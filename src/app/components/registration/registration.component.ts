import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  error: string;
  returnUrl: string;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  register() {
    this.submitted = true;

    if (this.registrationForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.signUpCustomerLocal(this.registrationForm.value)
      .pipe(first())
      .subscribe(
        result => this.router.navigate([this.returnUrl]),
        err => {
          this.error = `Nastąpił błąd podczas procesu rejestrowania. ${err.error.message}`;
          this.loading = false;
        }
      );
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
    this.registrationForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['M'],
      dob: [''],
      street: [''],
      postalCode: [''],
      city: [''],
      phone: ['']
    });
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.returnUrl = params.returnUrl || '/home';
    });
  }

}
