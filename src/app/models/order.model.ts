import { Deserializable } from './deserializable.model';

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
  status: 'PENDING_PAYMENT' | 'PENDING' | 'PROCESSING' | 'PENDING_SHIPMENT' | 'SEND' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'BLIK' | 'PAYPAL';

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
