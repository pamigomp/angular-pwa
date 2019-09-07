import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable, throwError } from 'rxjs';
import { ShippingModel } from '../../models/shipping.model';
import { catchError, map } from 'rxjs/operators';
import { CustomResponse, ErrorResponse } from '../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private readonly SERVER_API_URL: string;

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.SERVER_API_URL = this.configService.get('API_URL');
  }

  getAllShippings(): Observable<ShippingModel[]> {
    return this.httpClient.get<ShippingModel[]>(`${this.SERVER_API_URL}/shippings`).pipe(
      map(data => data.map(item => new ShippingModel().deserialize(item))),
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  createShipping(newShipping: ShippingModel): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(`${this.SERVER_API_URL}/shippings`, newShipping).pipe(
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  getShipping(id: string): Observable<ShippingModel> {
    return this.httpClient.get<ShippingModel>(`${this.SERVER_API_URL}/shippings/${id}`).pipe(
      map(data => new ShippingModel().deserialize(data)),
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  updateShipping(updatedShipping: ShippingModel): Observable<CustomResponse> {
    return this.httpClient.put<CustomResponse>(`${this.SERVER_API_URL}/shippings/${updatedShipping._id}`, updatedShipping).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  deleteShipping(id: string): Observable<CustomResponse> {
    return this.httpClient.delete<CustomResponse>(`${this.SERVER_API_URL}/shippings/${id}`).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }
}
