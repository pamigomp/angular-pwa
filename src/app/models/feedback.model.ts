import { Deserializable } from './deserializable.model';

export class FeedbackModel implements Deserializable {
  _id: string;
  value: string;
  customerId: string;
  productId: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
