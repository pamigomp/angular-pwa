import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { CustomerService } from '../../services/customer/customer.service';
import { OrderService } from '../../services/order/order.service';
import { AuthService } from '../../services/auth/auth.service';
import { OrderModel } from '../../models/order.model';
import { CustomerModel } from '../../models/customer.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  error: string;
  loading = false;
  submitted = false;
  displayedColumns: string[] = ['paymentStatus', 'totalPrice', 'shippingDate', 'additionalInformation', 'shippingId', 'status', 'paymentMethod'];
  orders: OrderModel[];
  private customerId: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private orderService: OrderService, private customerService: CustomerService) {
  }

  update() {
    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    this.customerService.updateCustomer(this.profileForm.value)
      .pipe(first())
      .subscribe(
        result => console.log('Successfully updated'),
        err => {
          this.error = `Nastąpił błąd podczas aktualizowania danych osobowych. ${err.error.message}`;
          this.loading = false;
        }
      );
  }

  ngOnInit() {
    this.customerId = this.authService.getId();
    this.profileForm = this.formBuilder.group({
      _id: [this.customerId],
      email: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: [''],
      dob: [''],
      street: [''],
      postalCode: [''],
      city: [''],
      phone: ['']
    });
    this.customerService.getCustomer(this.customerId).subscribe((customer: CustomerModel) => {
      this.profileForm = this.formBuilder.group({
        _id: [this.customerId],
        email: [customer.email, Validators.required],
        password: [customer.password, Validators.required],
        firstName: [customer.firstName, Validators.required],
        lastName: [customer.lastName, Validators.required],
        gender: [customer.gender],
        dob: [customer.dob],
        street: [customer.street],
        postalCode: [customer.postalCode],
        city: [customer.city],
        phone: [customer.phone]
      });
    });

    this.orderService.getAllOrdersForCustomerWithId(this.customerId).subscribe((orders: OrderModel[]) => {
      this.orders = orders;
    });
  }

  getShippingTitle(shippingId: string) {
    return
  }
}
