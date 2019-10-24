import { Deserializable } from './deserializable.model';
import { Payment } from '../enums/payment-method.enum';
import { Status } from '../enums/status.enum';

export class OrderModel implements Deserializable {
  _id?: string;
  paymentStatus: boolean;
  discountCode?: string;
  totalPrice: number;
  shippingDate?: string;
  additionalInformation: string;
  products: CartProductModel[];
  employeeId?: string;
  customerId: string;
  shippingId: string;
  status: Status;
  paymentMethod: Payment;
  createdAt?: string;
  updatedAt?: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
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


