import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { AuthResponse } from '../../models/response.model';
import { CustomerModel } from '../../models/customer.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EmployeeModel } from '../../models/employee.model';

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

  get isAuthenticated(): boolean {
    const accessToken = this.getToken();
    return accessToken && !helper.isTokenExpired(accessToken);
  }

  get isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

  getToken(): string {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRole(): string {
    const accessToken = this.getToken();
    if (accessToken) {
      return helper.decodeToken(accessToken).role;
    } else {
      return null;
    }
  }

  getId(): string {
    const accessToken = this.getToken();
    if (accessToken) {
      return helper.decodeToken(accessToken).id;
    } else {
      return null;
    }
  }

  signInCustomerLocal(email: string, password: string): Observable<boolean> {
    return this.httpClient.post<{ user: AuthResponse }>(`${this.SERVER_API_URL}/signin/customer/local`, {
      email,
      password
    }).pipe(
      map(this.saveToken())
    );
  }

  signUpCustomerLocal(newCustomer: CustomerModel): Observable<boolean> {
    return this.httpClient.post<{ user: AuthResponse }>(`${this.SERVER_API_URL}/signup/customer/local`, newCustomer).pipe(
      map(this.saveToken())
    );
  }

  signInCustomerFacebook(): Observable<boolean> {
    return this.httpClient.get<{ user: AuthResponse }>(`${this.SERVER_API_URL}/signin/customer/facebook`).pipe(
      map(this.saveToken())
    );
  }

  signInEmployeeLocal(email: string, password: string): Observable<boolean> {
    return this.httpClient.post<{ user: AuthResponse }>(`${this.SERVER_API_URL}/signin/employee/local`, {
      email,
      password
    }).pipe(
      map(this.saveToken())
    );
  }

  signUpEmployeeLocal(newEmployee: EmployeeModel): Observable<boolean> {
    return this.httpClient.post<{ user: AuthResponse }>(`${this.SERVER_API_URL}/signup/employee/local`, newEmployee)
      .pipe(
        map(this.saveToken())
      );
  }

  logout() {
    localStorage.removeItem(this.accessTokenKey);
  }

  private saveToken() {
    return data => {
      localStorage.setItem(this.accessTokenKey, data.user.token);
      return true;
    };
  }
}
