import { Component, OnInit } from '@angular/core';
import { PaginatedProductModel } from '../../models/paginated-product.model';
import { ProductService } from '../../services/product/product.service';
import { ImageService } from '../../services/image/image.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductQueryParamsModel } from '../../models/product-query-params.model';
import { ProductModel } from '../../models/product.model';
import { ImageModel } from '../../models/image.model';
import { CategoryService } from '../../services/category/category.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PageEvent } from '@angular/material';
import { SortOptionModel } from '../../models/sort-option.model';
import { CartService } from '../../services/cart/cart.service';
import { RateService } from '../../services/rate/rate.service';
import { RateModel, RateValue } from '../../models/rate.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  products: PaginatedProductModel = {} as PaginatedProductModel;
  categoryName: string;
  categoryId: string;
  selectedSortOption = 'Nazwa: A-Z';
  selectedPage = 0;
  selectedPageSize = 5;
  isStarRatingReadonly = false;
  sortOptions: SortOptionModel[] = [{
    sortBy: 'salePriceGross',
    sortDir: 'asc',
    title: 'Cena: od najniższej'
  }, {
    sortBy: 'salePriceGross',
    sortDir: 'desc',
    title: 'Cena: od najwyższej'
  }, {
    sortBy: 'title',
    sortDir: 'asc',
    title: 'Nazwa: A-Z'
  }, {
    sortBy: 'title',
    sortDir: 'desc',
    title: 'Nazwa: Z-A'
  }, {
    sortBy: 'rate',
    sortDir: 'desc',
    title: 'Ocena: od najlepszej',
    disabled: true
  }];

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private imageService: ImageService,
    private cartService: CartService,
    private rateService: RateService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
  }

  get isCollectionEmpty(): boolean {
    return this.products.collection && this.products.collection.length === 0;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.categoryName = params.name;
    });
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.categoryId = params.id;
      this.getProducts();
    });
  }

  changePage($event: PageEvent): void {
    this.selectedPage = $event.pageIndex;
    this.selectedPageSize = $event.pageSize;
    this.getProducts();
  }

  changeSortOption(): void {
    this.getProducts();
  }

  getSelectedSortOptionProps(): SortOptionModel {
    return this.sortOptions.find((sortOption: SortOptionModel) => sortOption.title === this.selectedSortOption);
  }

  getProducts(): void {
    const selectedOptionProps = this.getSelectedSortOptionProps();
    const queryParams: ProductQueryParamsModel = {
      sortBy: selectedOptionProps.sortBy,
      sortDir: selectedOptionProps.sortDir,
      page: this.selectedPage + 1,
      limit: this.selectedPageSize
    };
    this.productService.getAllProductsForCategoryWithId(this.categoryId, queryParams)
      .pipe(
        catchError((err: string) => {
          this.products.collection = [];
          return throwError(err);
        })
      )
      .subscribe((paginatedProducts: PaginatedProductModel) => {
        paginatedProducts.collection.length && paginatedProducts.collection.forEach((product: ProductModel, index: number) => {
          this.imageService.getAllImagesForProductWithId(product._id).subscribe((images: ImageModel[]) => {
            paginatedProducts.collection[index].imgUrl = images[0].url;
          });
          this.isStarRatingReadonly = false;
          this.rateService.getAllRatesForProductWithId(product._id).subscribe((rates: RateModel[]) => {
            paginatedProducts.collection[index].averageRate = this.calculateAverageRate(rates);
            paginatedProducts.collection[index].rates = rates;
            // this.isStarRatingReadonly = true; //TODO Fix setting star rating readonly mode
          });
        });
        this.products = paginatedProducts;
      });
  }

  openProductPage(product: ProductModel): void {
    this.router.navigate(['/products', product._id]);
  }

  addToCart(product: ProductModel): void {
    this.cartService.addToCart(product);
  }

  isProductAddedToCart(product: ProductModel): boolean {
    return this.cartService.isProductAddedToCart(product);
  }

  getRatesCount(rates: RateModel[]): number {
    return rates ? rates.length : 0;
  }

  private calculateAverageRate(rates: RateModel[]): number {
    const rateCount = this.getRatesCount(rates);
    const rateSum = rates.map((rate: RateModel) => +rate.value).reduce((acc: number, value: number) => acc + value, 0);
    return rateSum / rateCount;
  }
}
