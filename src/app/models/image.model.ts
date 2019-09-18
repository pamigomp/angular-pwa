import { Deserializable } from './deserializable.model';

export class ImageModel implements Deserializable {
  _id: string;
  url = 'https://via.placeholder.com/512';
  productId: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}