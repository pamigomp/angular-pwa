import { Deserializable } from './deserializable.model';
import { Payment } from '../enums/payment-method.enum';
import { Status } from '../enums/status.enum';
import { Shipping } from '../enums/shipping-method.enum';

export class OrderModel implements Deserializable {
  _id: string;
  paymentStatus: boolean;
  discount?: string;
  totalPrice: number;
  shippingDate?: string;
  additionalInformation: string;
  products: CartProductModel[];
  employeeId?: string;
  customerId: string;
  shippingId: string;
  status: Status;
  paymentMethod: Payment;
  shippingMethod?: Shipping;
  createdAt: string;
  updatedAt: string;

  deserialize(input: any): this {
    Object.assign(this, input);
    this.products = input.products.map((product: CartProductModel) => new CartProductModel().deserialize(product));
    return this;
  }
}

export class CartProductModel implements Deserializable {
  id: string;
  price: number;
  amount: number;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}


