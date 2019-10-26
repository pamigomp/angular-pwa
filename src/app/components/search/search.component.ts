import { Component, OnInit } from '@angular/core';
import { PaginatedProductModel } from '../../models/paginated-product.model';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductQueryParamsModel } from '../../models/product-query-params.model';
import { ImageService } from '../../services/image/image.service';
import { ProductModel } from '../../models/product.model';
import { ImageModel } from '../../models/image.model';
import { PageEvent } from '@angular/material';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SortOptionModel } from '../../models/sort-option.model';
import { CartService } from '../../services/cart/cart.service';
import { RateModel } from '../../models/rate.model';
import { RateService } from '../../services/rate/rate.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchQuery: string;
  products: PaginatedProductModel = {} as PaginatedProductModel;
  selectedSortOption = 'Nazwa: A-Z';
  selectedPage = 0;
  selectedPageSize = 5;
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
  isStarRatingReadonly = false;
  minPrice: number;
  maxPrice: number;

  constructor(
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
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.searchQuery = params.query;
      this.getProducts();
    });
  }

  changePage($event: PageEvent): void {
    this.selectedPage = $event.pageIndex;
    this.selectedPageSize = $event.pageSize;
    this.getProducts();
  }

  getSelectedSortOptionProps(): SortOptionModel {
    return this.sortOptions.find((sortOption: SortOptionModel) => sortOption.title === this.selectedSortOption);
  }

  getProducts(): void {
    const selectedOptionProps = this.getSelectedSortOptionProps();
    const queryParams: ProductQueryParamsModel = {
      search: this.searchQuery,
      sortBy: selectedOptionProps.sortBy,
      sortDir: selectedOptionProps.sortDir,
      page: this.selectedPage + 1,
      limit: this.selectedPageSize
    };
    if (this.minPrice) {
      queryParams.minPrice = this.minPrice;
    }
    if (this.maxPrice) {
      queryParams.maxPrice = this.maxPrice;
    }
    this.productService.getAllProducts(queryParams)
      .pipe(
        catchError((err: string) => {
          this.products.collection = [];
          return throwError(err);
        })
      )
      .subscribe((searchResult: PaginatedProductModel) => {
        searchResult.collection.length && searchResult.collection.forEach((product: ProductModel, index: number) => {
          this.imageService.getAllImagesForProductWithId(product._id).subscribe((images: ImageModel[]) => {
            searchResult.collection[index].imgUrl = images[0].url;
          });
          this.isStarRatingReadonly = false;
          this.rateService.getAllRatesForProductWithId(product._id).subscribe((rates: RateModel[]) => {
            searchResult.collection[index].averageRate = this.calculateAverageRate(rates);
            searchResult.collection[index].rates = rates;
            // this.isStarRatingReadonly = true; //TODO Fix setting star rating readonly mode
          });
        });
        this.products = searchResult;
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
