import { Deserializable } from './deserializable.model';
import { Payment } from '../enums/payment-method.enum';
import { Status } from '../enums/status.enum';
import { Shipping } from '../enums/shipping-method.enum';

export class OrderModel implements Deserializable {
  _id: string;
  paymentStatus = false;
  discount?: string;
  totalPrice: number;
  shippingDate?: string;
  additionalInformation: string;
  cartId: string;
  employeeId?: string;
  customerId: string;
  shippingId: string;
  status: Status;
  paymentMethod: Payment;
  shippingMethod?: Shipping;
  createdAt: string;
  updatedAt: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

