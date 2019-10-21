import { Deserializable } from './deserializable.model';

export class CustomerModel implements Deserializable {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender?: 'M' | 'F';
  dob?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
  regular: boolean;
  lastLogin: string;
  salt?: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
