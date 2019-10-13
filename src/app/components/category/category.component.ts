import { Component, OnInit } from '@angular/core';
import { PaginatedProductModel } from '../../models/paginated-product.model';
import { ProductService } from '../../services/product/product.service';
import { ImageService } from '../../services/image/image.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductQueryParamsModel } from '../../models/product-query-params.model';
import { ProductModel } from '../../models/product.model';
import { ImageModel } from '../../models/image.model';
import { CategoryService } from '../../services/category/category.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  products: PaginatedProductModel = {} as PaginatedProductModel;
  categoryName: string;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private imageService: ImageService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.categoryName = params.name;
    });
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      const queryParams: ProductQueryParamsModel = {
        sortBy: 'title',
        sortDir: '1',
        page: 1,
        limit: 10
      };
      this.productService.getAllProductsForCategoryWithId(params.id, queryParams)
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
          });
          this.products = paginatedProducts;
        });
    });
  }

  isCollectionEmpty(): boolean {
    return this.products.collection && this.products.collection.length === 0;
  }
}
