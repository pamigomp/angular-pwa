import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartModel } from '../../models/cart.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { CustomResponse, ErrorResponse } from '../../models/response.model';
import { ProductModel } from '../../models/product.model';
import { sortObjectKeys } from '../../common/common';

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

  addToCart(product: ProductModel): void {
    delete product.id;
    delete product.imgUrl;
    const sortObjectKeys = obj => Object.keys(obj).sort().reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
    const sortedProductKeys = sortObjectKeys(product);
    const cartProducts: Set<string> = new Set(JSON.parse(localStorage.getItem('cartProducts'))) || new Set();
    if (!cartProducts.has(JSON.stringify(sortedProductKeys))) {
      cartProducts.add(JSON.stringify(sortedProductKeys));
    }
    localStorage.setItem('cartProducts', JSON.stringify(Array.from(cartProducts)));
  }

  isProductAddedToCart(product: ProductModel): boolean {
    const productCopy = Object.assign({}, product);
    delete productCopy.id;
    delete productCopy.imgUrl;
    const sortedProductKeys = sortObjectKeys(product);
    const cartProducts: Set<string> = new Set(JSON.parse(localStorage.getItem('cartProducts'))) || new Set();
    return cartProducts.has(JSON.stringify(sortedProductKeys));
  }

  getAllProductsAddedToCart(): ProductModel[] {
    const cartProducts: Set<string> = new Set(JSON.parse(localStorage.getItem('cartProducts'))) || new Set();
    const products: ProductModel[] = [];
    cartProducts.forEach((product: string) => {
      products.push(JSON.parse(product));
    });
    return products;
  }

  getCartTotalPrice(): number {
    const products: ProductModel[] = this.getAllProductsAddedToCart();
    let total = 0;
    products.forEach((product: ProductModel) => {
      total += product.salePriceGross;
    });
    return total;
  }
}
