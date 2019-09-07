import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable, throwError } from 'rxjs';
import { ProducerModel } from '../../models/producer.model';
import { catchError, map } from 'rxjs/operators';
import { CustomResponse, ErrorResponse } from '../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ProducerService {
  private readonly SERVER_API_URL: string;

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.SERVER_API_URL = this.configService.get('API_URL');
  }

  getAllProducers(): Observable<ProducerModel[]> {
    return this.httpClient.get<ProducerModel[]>(`${this.SERVER_API_URL}/producers`).pipe(
      map(data => data.map(item => new ProducerModel().deserialize(item))),
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  createProducer(newProducer: ProducerModel): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(`${this.SERVER_API_URL}/producers`, newProducer).pipe(
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  getProducer(id: string): Observable<ProducerModel> {
    return this.httpClient.get<ProducerModel>(`${this.SERVER_API_URL}/producers/${id}`).pipe(
      map(data => new ProducerModel().deserialize(data)),
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  updateProducer(updatedProducer: ProducerModel): Observable<CustomResponse> {
    return this.httpClient.put<CustomResponse>(`${this.SERVER_API_URL}/producers/${updatedProducer._id}`, updatedProducer).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  deleteProducer(id: string): Observable<CustomResponse> {
    return this.httpClient.delete<CustomResponse>(`${this.SERVER_API_URL}/producers/${id}`).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }
}
