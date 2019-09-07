import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable, throwError } from 'rxjs';
import { OrderModel } from '../../models/order.model';
import { catchError, map } from 'rxjs/operators';
import { CustomResponse, ErrorResponse } from '../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly SERVER_API_URL: string;

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.SERVER_API_URL = this.configService.get('API_URL');
  }

  getAllOrders(): Observable<OrderModel[]> {
    return this.httpClient.get<OrderModel[]>(`${this.SERVER_API_URL}/orders`).pipe(
      map(data => data.map(item => new OrderModel().deserialize(item))),
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  getOrder(id: string): Observable<OrderModel> {
    return this.httpClient.get<OrderModel>(`${this.SERVER_API_URL}/orders/${id}`).pipe(
      map(data => new OrderModel().deserialize(data)),
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  updateOrder(updatedOrder: OrderModel): Observable<CustomResponse> {
    return this.httpClient.put<CustomResponse>(`${this.SERVER_API_URL}/orders/${updatedOrder._id}`, updatedOrder).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  deleteOrder(id: string): Observable<CustomResponse> {
    return this.httpClient.delete<CustomResponse>(`${this.SERVER_API_URL}/orders/${id}`).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  getAllOrdersForCustomerWithId(customerId: string): Observable<OrderModel[]> {
    return this.httpClient.get<OrderModel[]>(`${this.SERVER_API_URL}/customers/${customerId}/orders`).pipe(
      map(data => data.map(item => new OrderModel().deserialize(item))),
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  createOrderForCustomerWithId(customerId: string, newOrder: OrderModel): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(`${this.SERVER_API_URL}/customers/${customerId}/orders`, newOrder).pipe(
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }
}
