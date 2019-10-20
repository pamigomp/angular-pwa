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
  feedback: string;
  private productId: string;
  currentRoute: string;

  constructor(private productService: ProductService,
              private imageService: ImageService,
              private rateService: RateService,
              private feedbackService: FeedbackService,
              private cartService: CartService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
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

  calculateAverageRate(): number {
    const rateCount = this.rates.length;
    if (rateCount === 0) {
      return 0;
    }
    let rateSum = 0;
    this.rates.forEach((rate: RateModel) => {
      rateSum += +rate.value;
    });
    return rateSum / rateCount;
  }

  rateProduct($event: { oldValue: number; newValue: number; starRating: StarRatingComponent }): void {
    const rate: Partial<RateModel> = {
      value: $event.newValue.toString() as RateValue,
      customerId: this.customerId
    };
    this.rateService.createRateForProductWithId(this.productId, rate).subscribe();
    this.getRates();
  }

  addComment(): void {
    const feedback: Partial<FeedbackModel> = {
      customerId: this.customerId,
      value: this.feedback
    };
    this.feedbackService.createFeedbackForProductWithId(this.productId, feedback).subscribe();
    this.getFeedbacks();
  }

  private getProduct(): void {
    this.productService.getProduct(this.productId).subscribe((product: ProductModel) => {
      this.product = product;
    });
  }

  private getImages() {
    this.imageService.getAllImagesForProductWithId(this.productId).subscribe((images: ImageModel[]) => {
      this.images = images;
    });
  }

  private getRates() {
    this.rateService.getAllRatesForProductWithId(this.productId).subscribe((rates: RateModel[]) => {
      this.rates = rates;
      this.isStarRatingReadonly = false;
      this.averageRate = this.calculateAverageRate();
      this.isStarRatingReadonly = true;
    });
  }

  private getFeedbacks() {
    this.feedbackService.getAllFeedbacksForProductWithId(this.productId).subscribe((feedbacks: FeedbackModel[]) => {
      this.feedbacks = feedbacks;
    });
  }
}
