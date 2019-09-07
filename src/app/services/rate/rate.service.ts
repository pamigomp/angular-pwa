import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable, throwError } from 'rxjs';
import { RateModel } from '../../models/rate.model';
import { catchError, map } from 'rxjs/operators';
import { CustomResponse, ErrorResponse } from '../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class RateService {
  private readonly SERVER_API_URL: string;

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.SERVER_API_URL = this.configService.get('API_URL');
  }

  getRate(id: string): Observable<RateModel> {
    return this.httpClient.get<RateModel>(`${this.SERVER_API_URL}/rates/${id}`).pipe(
      map(data => new RateModel().deserialize(data)),
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  updateRate(updatedRate: RateModel): Observable<CustomResponse> {
    return this.httpClient.put<CustomResponse>(`${this.SERVER_API_URL}/rates/${updatedRate._id}`, updatedRate).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  deleteRate(id: string): Observable<CustomResponse> {
    return this.httpClient.delete<CustomResponse>(`${this.SERVER_API_URL}/rates/${id}`).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  getAllRatesForProductWithId(productId: string): Observable<RateModel[]> {
    return this.httpClient.get<RateModel[]>(`${this.SERVER_API_URL}/products/${productId}/rates`).pipe(
      map(data => data.map(item => new RateModel().deserialize(item))),
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  createRateForProductWithId(productId: string, newRate: RateModel): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(`${this.SERVER_API_URL}/products/${productId}//rates`, newRate).pipe(
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }
}
