import { Deserializable } from './deserializable.model';

export class CartModel implements Deserializable {
  products: CartProductModel[];
  customerId: string;

  deserialize(input: any): this {
    Object.assign(this, input);
    this.products = input.products.map((product: CartProductModel) => new CartProductModel().deserialize(product));
    return this;
  }
}

export class CartProductModel implements Deserializable {
  id: string;
  price: number;
  amount: number;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
