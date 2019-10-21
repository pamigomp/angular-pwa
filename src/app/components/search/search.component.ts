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

  constructor(
    private productService: ProductService,
    private imageService: ImageService,
    private cartService: CartService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.searchQuery = params.query;
      this.getProducts();
    });
  }

  get isCollectionEmpty(): boolean {
    return this.products.collection && this.products.collection.length === 0;
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
      search: this.searchQuery,
      sortBy: selectedOptionProps.sortBy,
      sortDir: selectedOptionProps.sortDir,
      page: this.selectedPage + 1,
      limit: this.selectedPageSize
    };
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
}
