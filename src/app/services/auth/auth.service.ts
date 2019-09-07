import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { AuthResponse } from '../../models/response.model';
import { CustomerModel } from '../../models/customer.model';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly SERVER_API_URL: string;
  private readonly accessTokenKey = 'access_token';

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.SERVER_API_URL = this.configService.get('API_URL');
  }

  getToken(): string {
    return localStorage.getItem(this.accessTokenKey);
  }

  isAuthenticated(): boolean {
    const accessToken = this.getToken();
    return accessToken && !helper.isTokenExpired(accessToken);
  }

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

  getRole(): string {
    const accessToken = this.getToken();
    if (accessToken) {
      return helper.decodeToken(accessToken).role;
    } else {
      return null;
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return this.httpClient.post<{ user: AuthResponse }>(`${this.SERVER_API_URL}/signin/customer/local`, {
      email,
      password
    }).pipe(
      map(data => {
        localStorage.setItem(this.accessTokenKey, data.user.token);
        return true;
      })
    );
  }

  register(newCustomer: CustomerModel) {
    return this.httpClient.post<{ user: AuthResponse }>(`${this.SERVER_API_URL}/signup/customer/local`, newCustomer)
      .pipe(tap(data => this.login(newCustomer.email, newCustomer.password)));
  }

  logout() {
    localStorage.removeItem(this.accessTokenKey);
  }
}
