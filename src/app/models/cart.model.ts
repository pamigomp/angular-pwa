import { Deserializable } from './deserializable.model';

export class CartModel implements Deserializable {
  _id: string;
  products: CartProductModel[];
  customerId: string;
  createdAt: string;
  updatedAt: string;

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
