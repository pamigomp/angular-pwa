import { Deserializable } from './deserializable.model';

export class ShippingModel implements Deserializable {
  method: 'COLLECTION_IN_PERSON' | 'CASH_ON_DELIVERY' | 'COURIER_PREPAYMENT' | 'POCZTA_POLSKA' | 'PACZKOMATY_INPOST';
  price: number;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
