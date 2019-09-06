import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
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

  constructor(private authService: AuthService, private router: Router) {
  }

  submit() {
    this.authService.login(this.username, this.password)
      .pipe(first())
      .subscribe(
        result => this.router.navigate(['todos']),
        err => this.error = 'Could not authenticate'
      );
  }

  ngOnInit() {
  }

}
