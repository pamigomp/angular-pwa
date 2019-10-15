import { Deserializable } from './deserializable.model';
import { ProductModel } from './product.model';

export class PaginatedProductModel implements Deserializable {
  collection: ProductModel[];
  total: number;
  size: number;
  pages: number;
  page: number;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
