import { Deserializable } from './deserializable.model';
import { RateModel } from './rate.model';

export class ProductModel implements Deserializable {
  _id: string;
  title: string;
  saleTaxRate: number;
  salePriceGross: number;
  description: string;
  stockAmount = 0;
  categoryId: string;
  producerId: string;
  imgUrl?: string;
  rates?: RateModel[];
  averageRate?: number;
  id?: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
