import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  error: string;
  returnUrl: string;

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  submit() {
    this.authService.signInCustomerLocal(this.username, this.password)
      .pipe(first())
      .subscribe(
        result => this.router.navigate([this.returnUrl]),
        err => this.error = 'Could not authenticate'
      );
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.returnUrl = params.returnUrl || '/home';
    });
  }

}
