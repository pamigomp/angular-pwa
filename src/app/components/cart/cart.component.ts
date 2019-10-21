import { Component, OnInit } from '@angular/core';
import { ShippingService } from '../../services/shipping/shipping.service';
import { AuthService } from '../../services/auth/auth.service';
import { ShippingModel } from '../../models/shipping.model';
import { Payment, PaymentMethodEnum } from '../../enums/payment-method.enum';
import { Shipping, ShippingMethodEnum } from '../../enums/shipping-method.enum';
import { CartService } from '../../services/cart/cart.service';
import { ProductModel } from '../../models/product.model';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  shippings: ShippingModel[];
  payments: Payment[] = ['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'BLIK', 'PAYPAL'];
  displayedColumns: string[] = ['title', 'salePriceGross', 'quantity', 'totalPriceGross'];
  dataSource: MatTableDataSource<ProductModel>;
  cartProducts: ProductModel[];

  constructor(private authService: AuthService,
              private cartService: CartService,
              private shippingService: ShippingService) {
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  ngOnInit() {
    this.shippingService.getAllShippings().subscribe((shippings: ShippingModel[]) => {
      this.shippings = shippings;
    });
    this.cartProducts = this.cartService.getAllProductsAddedToCart().map((product: ProductModel) => {
      return new ProductModel().deserialize({
        ...product,
        orderQuantity: 1
      });
    });

    this.dataSource = new MatTableDataSource(this.cartProducts);
  }

  getShippingMethod(shippingMethod: Shipping): ShippingMethodEnum {
    return ShippingMethodEnum[shippingMethod];
  }

  getPaymentMethod(paymentMethod: Payment): PaymentMethodEnum {
    return PaymentMethodEnum[paymentMethod];
  }

  getTotalCost(): number {
    return this.cartService.getCartTotalPrice();
  }

  decreaseQuantity(cartProduct: ProductModel): void {
    if (cartProduct.orderQuantity !== 1) {
      --cartProduct.orderQuantity;
    }
  }

  increaseQuantity(cartProduct: ProductModel): void {
    ++cartProduct.orderQuantity;
  }
}
