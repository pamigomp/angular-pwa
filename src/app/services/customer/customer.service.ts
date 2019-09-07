import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable, throwError } from 'rxjs';
import { CustomerModel } from '../../models/customer.model';
import { catchError, map } from 'rxjs/operators';
import { CustomResponse, ErrorResponse } from '../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly SERVER_API_URL: string;

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.SERVER_API_URL = this.configService.get('API_URL');
  }

  getAllCustomers(): Observable<CustomerModel[]> {
    return this.httpClient.get<CustomerModel[]>(`${this.SERVER_API_URL}/customers`).pipe(
      map(data => data.map(item => new CustomerModel().deserialize(item))),
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  createCustomer(newCustomer: CustomerModel): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(`${this.SERVER_API_URL}/customers`, newCustomer).pipe(
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  getCustomer(id: string): Observable<CustomerModel> {
    return this.httpClient.get<CustomerModel>(`${this.SERVER_API_URL}/customers/${id}`).pipe(
      map(data => new CustomerModel().deserialize(data)),
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  updateCustomer(updatedCustomer: CustomerModel): Observable<CustomResponse> {
    return this.httpClient.put<CustomResponse>(`${this.SERVER_API_URL}/customers/${updatedCustomer._id}`, updatedCustomer).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  deleteCustomer(id: string): Observable<CustomResponse> {
    return this.httpClient.delete<CustomResponse>(`${this.SERVER_API_URL}/customers/${id}`).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }
}
