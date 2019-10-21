import { Deserializable } from './deserializable.model';
import { RateModel } from './rate.model';

export class ProductModel implements Deserializable {
  _id: string;
  title: string;
  saleTaxRate: number;
  salePriceGross: number;
  description: string;
  stockAmount: number;
  categoryId: string;
  producerId: string;
  imgUrl?: string;
  rates?: RateModel[];
  averageRate?: number;
  id?: string;
  orderQuantity?: number;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
