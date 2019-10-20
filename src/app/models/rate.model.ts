import { Deserializable } from './deserializable.model';

export class RateModel implements Deserializable {
  _id: string;
  value: RateValue;
  customerId: string;
  productId: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}


export type RateValue = '1' | '2' | '3' | '4' | '5';
