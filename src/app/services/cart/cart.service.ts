import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartModel } from '../../models/cart.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { CustomResponse, ErrorResponse } from '../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly SERVER_API_URL: string;

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.SERVER_API_URL = this.configService.get('API_URL');
  }

  getCartForCustomerWithId(customerId: string): Observable<CartModel> {
    return this.httpClient.get<CartModel>(`${this.SERVER_API_URL}/customers/${customerId}/cart`).pipe(
      map(data => new CartModel().deserialize(data)),
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  createCartForCustomerWithId(customerId: string, newCart: CartModel): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(`${this.SERVER_API_URL}/customers/${customerId}/cart`, newCart).pipe(
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  updateCartForCustomerWithId(customerId: string, updatedCart: CartModel): Observable<CustomResponse> {
    return this.httpClient.put<CustomResponse>(`${this.SERVER_API_URL}/customers/${customerId}/cart`, updatedCart).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  deleteCartForCustomerWithId(customerId: string): Observable<CustomResponse> {
    return this.httpClient.delete<CustomResponse>(`${this.SERVER_API_URL}/customers/${customerId}/cart`).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }
}
