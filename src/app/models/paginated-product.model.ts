import { Deserializable } from './deserializable.model';
import { ProductModel } from './product.model';

export class PaginatedProductModel implements Deserializable {
  collection: ProductModel[];
  total: number;
  pages: number;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
