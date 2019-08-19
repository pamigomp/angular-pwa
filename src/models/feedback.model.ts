import { Deserializable } from './deserializable.model';

export class FeedbackModel implements Deserializable {
  value: string;
  customerId: string;
  productId: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
