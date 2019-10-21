import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
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

  addToCart(product: ProductModel): void {
    const productCopy = Object.assign({}, product);
    delete productCopy.id;
    delete productCopy.imgUrl;
    delete productCopy.rates;
    delete productCopy.averageRate;
    const sortedProductKeys = sortObjectKeys(productCopy);
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
    delete productCopy.rates;
    delete productCopy.averageRate;
    const sortedProductKeys = sortObjectKeys(productCopy);
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
    return this.getAllProductsAddedToCart().map((product: ProductModel) => product.salePriceGross).reduce((acc: number, value: number) => acc + value, 0);
  }
}
