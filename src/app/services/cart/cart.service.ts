import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartModel } from '../../../models/cart.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private SERVER_API_URL: string;

  constructor(private httpService: HttpClient, private configService: ConfigService) {
    this.SERVER_API_URL = this.configService.get('API_URL');
  }

  getCart(id: number): Observable<CartModel> {
    return this.httpService.get<CartModel>(`${this.SERVER_API_URL}/carts/${id}`).pipe(
      map(data => new CartModel().deserialize(data)),
      catchError(() => throwError('User not found'))
    );
  }

  getAllCarts(): Observable<CartModel[]> {
    return this.httpService.get<CartModel[]>(`${this.SERVER_API_URL}/carts`).pipe(
      map(data => data.map(item => new CartModel().deserialize(item)))
    );
  }
}
