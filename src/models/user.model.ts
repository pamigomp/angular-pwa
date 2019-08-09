export class UserModel {
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
  regular?: boolean = true;
  lastLogin: string;
  token: string;
  provider?: string;
  profilePicture?: string;
  emailVerified?: boolean = false;
}
