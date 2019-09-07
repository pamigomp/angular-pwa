import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable, throwError } from 'rxjs';
import { PositionModel } from '../../models/position.model';
import { catchError, map } from 'rxjs/operators';
import { CustomResponse, ErrorResponse } from '../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private readonly SERVER_API_URL: string;

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.SERVER_API_URL = this.configService.get('API_URL');
  }

  getAllPositions(): Observable<PositionModel[]> {
    return this.httpClient.get<PositionModel[]>(`${this.SERVER_API_URL}/positions`).pipe(
      map(data => data.map(item => new PositionModel().deserialize(item))),
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  createPosition(newPosition: PositionModel): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(`${this.SERVER_API_URL}/positions`, newPosition).pipe(
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  getPosition(id: string): Observable<PositionModel> {
    return this.httpClient.get<PositionModel>(`${this.SERVER_API_URL}/positions/${id}`).pipe(
      map(data => new PositionModel().deserialize(data)),
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  updatePosition(updatedPosition: PositionModel): Observable<CustomResponse> {
    return this.httpClient.put<CustomResponse>(`${this.SERVER_API_URL}/positions/${updatedPosition._id}`, updatedPosition).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  deletePosition(id: string): Observable<CustomResponse> {
    return this.httpClient.delete<CustomResponse>(`${this.SERVER_API_URL}/positions/${id}`).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }
}
