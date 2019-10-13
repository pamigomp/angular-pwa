import { Component, OnInit } from '@angular/core';
import { PaginatedProductModel } from '../../models/paginated-product.model';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductQueryParamsModel } from '../../models/product-query-params.model';
import { ImageService } from '../../services/image/image.service';
import { ProductModel } from '../../models/product.model';
import { ImageModel } from '../../models/image.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchQuery: string;
  products: PaginatedProductModel = {} as PaginatedProductModel;

  constructor(
    private productService: ProductService,
    private imageService: ImageService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.searchQuery = params.query;
      const queryParams: ProductQueryParamsModel = {
        search: this.searchQuery,
        sortBy: 'title',
        sortDir: '1',
        page: 1,
        limit: 10
      };
      this.productService.getAllProducts(queryParams)
        .subscribe((searchResult: PaginatedProductModel) => {
          searchResult.collection.length && searchResult.collection.forEach((product: ProductModel, index: number) => {
            this.imageService.getAllImagesForProductWithId(product._id).subscribe((images: ImageModel[]) => {
              searchResult.collection[index].imgUrl = images[0].url;
            });
          });
          this.products = searchResult;
        });
    });
  }

  isCollectionEmpty(): boolean {
    return this.products.collection.length === 0;
  }
}
