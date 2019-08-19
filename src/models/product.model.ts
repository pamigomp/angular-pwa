import { Deserializable } from './deserializable.model';

export class ProductModel implements Deserializable {
  title: string;
  saleTaxRate: number;
  salePriceGross: number;
  description: string;
  stockAmount = 0;
  categoryId: string;
  producerId: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
