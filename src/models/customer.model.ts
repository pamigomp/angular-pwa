export class CustomerModel {
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
  regular?: boolean = true;
  lastLogin: string;
  salt?: string;
}
