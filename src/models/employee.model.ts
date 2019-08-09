export class EmployeeModel {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  dob: string;
  street: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  employmentDate: string;
  dismissalDate?: string;
  positionId: string;
  lastLogin: string;
  salt?: string;
}
