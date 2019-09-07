import { Deserializable } from './deserializable.model';

export class RateModel implements Deserializable {
  _id: string;
  value: '1' | '2' | '3' | '4' | '5';
  customerId: string;
  productId: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
