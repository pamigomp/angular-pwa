import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductModel } from '../../models/product.model';
import { ImageService } from '../../services/image/image.service';
import { RateService } from '../../services/rate/rate.service';
import { ImageModel } from '../../models/image.model';
import { RateModel, RateValue } from '../../models/rate.model';
import { FeedbackService } from '../../services/feedback/feedback.service';
import { FeedbackModel } from '../../models/feedback.model';
import { CartService } from '../../services/cart/cart.service';
import { StarRatingComponent } from 'ng-starrating';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product: ProductModel = {} as ProductModel;
  images: ImageModel[] = [];
  rates: RateModel[] = [];
  feedbacks: FeedbackModel[] = [];
  customerId: string;
  averageRate: number;
  isStarRatingReadonly = false;
  feedback = '';
  currentRoute: string;
  currentCustomerRate: RateModel = {} as RateModel;
  currentCustomerFeedback: FeedbackModel = {} as FeedbackModel;
  private productId: string;

  constructor(private productService: ProductService,
              private imageService: ImageService,
              private rateService: RateService,
              private feedbackService: FeedbackService,
              private cartService: CartService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  ngOnInit() {
    this.currentRoute = this.router.url;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.productId = params.id;
      this.getProduct();
      this.getImages();
      this.getRates();
      this.getFeedbacks();
    });
    this.customerId = this.authService.getId();
  }

  addToCart(product: ProductModel): void {
    this.cartService.addToCart(product);
  }

  isProductAddedToCart(product: ProductModel): boolean {
    return this.cartService.isProductAddedToCart(product);
  }

  rateProduct($event: { oldValue: number; newValue: number; starRating: StarRatingComponent }): void {
    const rate: Partial<RateModel> = {
      customerId: this.customerId,
      value: $event.newValue.toString() as RateValue
    };
    this.isStarRatingReadonly = false;
    if (!this.currentCustomerRate.value) {
      this.rateService.createRateForProductWithId(this.productId, rate).subscribe(() => this.getRates());
    } else {
      rate._id = this.currentCustomerRate._id;
      rate.customerId = this.customerId;
      this.rateService.updateRate(rate).subscribe(() => {
        this.getRates();
      });
    }
  }

  addComment(): void {
    const feedback: Partial<FeedbackModel> = {
      customerId: this.customerId,
      value: this.feedback
    };
    if (!this.currentCustomerFeedback.value) {
      this.feedbackService.createFeedbackForProductWithId(this.productId, feedback).subscribe(() => this.getFeedbacks());
    } else {
      feedback._id = this.currentCustomerFeedback._id;
      feedback.customerId = this.customerId;
      this.feedbackService.updateFeedback(feedback).subscribe(() => {
        this.getFeedbacks();
      });
    }
  }

  getCurrentCustomerRateValue(): number {
    return +this.currentCustomerRate.value || 0;
  }

  getFeedbackAuthor(feedbackId: string): string {
    // TODO Get feedback author
    return 'M. Pietrzak';
  }

  private calculateAverageRate(): number {
    const rateCount = this.rates.length;
    const rateSum = this.rates.map((rate: RateModel) => +rate.value).reduce((acc: number, value: number) => acc + value, 0);
    return rateSum / rateCount;
  }

  private getProduct(): void {
    this.productService.getProduct(this.productId).subscribe((product: ProductModel) => {
      this.product = product;
    });
  }

  private getImages(): void {
    this.imageService.getAllImagesForProductWithId(this.productId).subscribe((images: ImageModel[]) => {
      this.images = images;
    });
  }

  private getRates(): void {
    this.rateService.getAllRatesForProductWithId(this.productId).subscribe((rates: RateModel[]) => {
      this.rates = rates;
      this.averageRate = this.calculateAverageRate();
      this.currentCustomerRate = this.getCurrentCustomerRate();
      this.isStarRatingReadonly = true;
    });
  }

  private getFeedbacks(): void {
    this.feedbackService.getAllFeedbacksForProductWithId(this.productId).subscribe((feedbacks: FeedbackModel[]) => {
      this.feedbacks = feedbacks.sort((a: FeedbackModel, b: FeedbackModel) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      this.currentCustomerFeedback = this.getCurrentCustomerFeedback();
      this.feedback = this.currentCustomerFeedback.value || '';
    });
  }

  private getCurrentCustomerRate(): RateModel {
    return this.rates.find((rate: RateModel) => rate.customerId === this.customerId) || {} as RateModel;
  }

  private getCurrentCustomerFeedback(): FeedbackModel {
    return this.feedbacks.find((feedback: FeedbackModel) => feedback.customerId === this.customerId) || {} as FeedbackModel;
  }
}
