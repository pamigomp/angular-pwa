import { Deserializable } from './deserializable.model';

export class ProducerModel implements Deserializable {
  name: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
