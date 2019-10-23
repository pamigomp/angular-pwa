import { Component, OnInit, ViewChild } from '@angular/core';
import { ShippingService } from '../../services/shipping/shipping.service';
import { AuthService } from '../../services/auth/auth.service';
import { ShippingModel } from '../../models/shipping.model';
import { Payment, PaymentMethodEnum } from '../../enums/payment-method.enum';
import { Shipping, ShippingMethodEnum } from '../../enums/shipping-method.enum';
import { CartService } from '../../services/cart/cart.service';
import { ProductModel } from '../../models/product.model';
import { MatSelectionList, MatSelectionListChange, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

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
  loginForm: FormGroup;
  error: string;
  loading = false;
  submitted = false;
  @ViewChild('shippingList', {static: true}) shippingList: MatSelectionList;
  @ViewChild('paymentList', {static: true}) paymentList: MatSelectionList;
  selectedShipping: string;
  selectedPayment: any;

  constructor(private authService: AuthService,
              private cartService: CartService,
              private shippingService: ShippingService,
              private formBuilder: FormBuilder) {
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  ngOnInit() {
    this.shippingService.getAllShippings().subscribe((shippings: ShippingModel[]) => {
      this.shippings = shippings;
    });
    this.getCartProducts();
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.shippingList.selectionChange.subscribe((s: MatSelectionListChange) => {
      this.shippingList.deselectAll();
      s.option.selected = true;
    });
    this.paymentList.selectionChange.subscribe((s: MatSelectionListChange) => {
      this.paymentList.deselectAll();
      s.option.selected = true;
    });
  }

  getCartProducts(): void {
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
    return this.cartProducts
      .map((product: ProductModel) => product.salePriceGross * product.orderQuantity)
      .reduce((acc: number, value: number) => acc + value, 0);
  }

  decreaseQuantity(cartProduct: ProductModel): void {
    if (cartProduct.orderQuantity !== 1) {
      --cartProduct.orderQuantity;
    }
  }

  increaseQuantity(cartProduct: ProductModel): void {
    ++cartProduct.orderQuantity;
  }

  login() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.signInCustomerLocal(this.loginForm.controls.email.value, this.loginForm.controls.password.value)
      .pipe(first())
      .subscribe(
        result => console.log('[App] Successfully logged in'),
        err => {
          this.error = `Nastąpił błąd podczas procesu logowania. ${err.error.message}`;
          this.loading = false;
        }
      );
  }

  deleteProductFromCart(productId: string): void {
    this.cartService.deleteProductFromCart(productId);
    this.getCartProducts();
  }
}
