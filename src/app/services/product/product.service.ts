import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable, throwError } from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { catchError, map } from 'rxjs/operators';
import { CustomResponse, ErrorResponse } from '../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly SERVER_API_URL: string;

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.SERVER_API_URL = this.configService.get('API_URL');
  }

  getProduct(id: string): Observable<ProductModel> {
    return this.httpClient.get<ProductModel>(`${this.SERVER_API_URL}/products/${id}`).pipe(
      map(data => new ProductModel().deserialize(data)),
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  updateProduct(updatedProduct: ProductModel): Observable<CustomResponse> {
    return this.httpClient.put<CustomResponse>(`${this.SERVER_API_URL}/products/${updatedProduct._id}`, updatedProduct).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  deleteProduct(id: string): Observable<CustomResponse> {
    return this.httpClient.delete<CustomResponse>(`${this.SERVER_API_URL}/products/${id}`).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  getAllProductsForCategoryWithId(categoryId: string): Observable<ProductModel[]> {
    return this.httpClient.get<ProductModel[]>(`${this.SERVER_API_URL}/categories/${categoryId}/products`).pipe(
      map(data => data.map(item => new ProductModel().deserialize(item))),
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  createProductForCategoryWithId(categoryId: string, newProduct: ProductModel): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(`${this.SERVER_API_URL}/categories/${categoryId}/products`, newProduct).pipe(
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }
}
