import { Deserializable } from './deserializable.model';

export class PositionModel implements Deserializable {
  _id: string;
  name: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
