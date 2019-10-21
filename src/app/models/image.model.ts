import { Deserializable } from './deserializable.model';

export class ImageModel implements Deserializable {
  _id: string;
  url: string;
  productId: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
