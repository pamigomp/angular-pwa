import { Deserializable } from './deserializable.model';
import { Shipping } from '../enums/shipping-method.enum';

export class ShippingModel implements Deserializable {
  _id: string;
  method: Shipping;
  price: number;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

