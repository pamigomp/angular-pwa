import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string;
  returnUrl: string;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  login() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.signInCustomerLocal(this.loginForm.controls.email.value, this.loginForm.controls.password.value)
      .pipe(first())
      .subscribe(
        result => this.router.navigate([this.returnUrl]),
        err => {
          this.error = `Could not authenticate. ${err.error.message}`;
          this.loading = false;
        }
      );
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.returnUrl = params.returnUrl || '/home';
    });
  }

}
