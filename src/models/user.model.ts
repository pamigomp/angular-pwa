import { Deserializable } from './deserializable.model';

export class UserModel implements Deserializable {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: 'M' | 'F';
  dob?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
  regular = true;
  lastLogin: string;
  token: string;
  provider?: 'FACEBOOK' | 'GOOGLE' | 'INSTAGRAM' | 'TWITTER';
  profilePicture?: string;
  emailVerified = false;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
