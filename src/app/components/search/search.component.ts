import { Component, OnInit } from '@angular/core';
import { PaginatedProductModel } from '../../models/paginated-product.model';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductQueryParamsModel } from '../../models/product-query-params.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchQuery: string;

  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.searchQuery = params.query || '/home';
      const queryParams: ProductQueryParamsModel = {
        search: this.searchQuery,
        sortBy: 'title',
        sortDir: '1',
        page: 1,
        limit: 10
      };
      this.searchQuery && this.productService.getAllProducts(queryParams)
        .subscribe((searchResult: PaginatedProductModel) => {
          console.log(searchResult);
        });
    });
  }
}
