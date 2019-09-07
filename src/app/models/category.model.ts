import { Deserializable } from './deserializable.model';

export class CategoryModel implements Deserializable {
  _id: string;
  name: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
