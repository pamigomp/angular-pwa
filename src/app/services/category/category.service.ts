import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CategoryModel } from '../../models/category.model';
import { CustomResponse, ErrorResponse } from '../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly SERVER_API_URL: string;

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.SERVER_API_URL = this.configService.get('API_URL');
  }

  getAllCategories(): Observable<CategoryModel[]> {
    return this.httpClient.get<CategoryModel[]>(`${this.SERVER_API_URL}/categories`).pipe(
      map(data => data.map(item => new CategoryModel().deserialize(item))),
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  createCategory(newCategory: CategoryModel): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(`${this.SERVER_API_URL}/categories`, newCategory).pipe(
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  getCategory(id: string): Observable<CategoryModel> {
    return this.httpClient.get<CategoryModel>(`${this.SERVER_API_URL}/categories/${id}`).pipe(
      map(data => new CategoryModel().deserialize(data)),
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  updateCategory(updatedCategory: CategoryModel): Observable<CustomResponse> {
    return this.httpClient.put<CustomResponse>(`${this.SERVER_API_URL}/categories/${updatedCategory._id}`, updatedCategory).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  deleteCategory(id: string): Observable<CustomResponse> {
    return this.httpClient.delete<CustomResponse>(`${this.SERVER_API_URL}/categories/${id}`).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }
}
