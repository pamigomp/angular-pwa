import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable, throwError } from 'rxjs';
import { FeedbackModel } from '../../models/feedback.model';
import { catchError, map } from 'rxjs/operators';
import { CustomResponse, ErrorResponse } from '../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private readonly SERVER_API_URL: string;

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.SERVER_API_URL = this.configService.get('API_URL');
  }

  getFeedback(id: string): Observable<FeedbackModel> {
    return this.httpClient.get<FeedbackModel>(`${this.SERVER_API_URL}/feedbacks/${id}`).pipe(
      map(data => new FeedbackModel().deserialize(data)),
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  updateFeedback(updatedFeedback: FeedbackModel): Observable<CustomResponse> {
    return this.httpClient.put<CustomResponse>(`${this.SERVER_API_URL}/feedbacks/${updatedFeedback._id}`, updatedFeedback).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  deleteFeedback(id: string): Observable<CustomResponse> {
    return this.httpClient.delete<CustomResponse>(`${this.SERVER_API_URL}/feedbacks/${id}`).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  getAllFeedbacksForProductWithId(productId: string): Observable<FeedbackModel[]> {
    return this.httpClient.get<FeedbackModel[]>(`${this.SERVER_API_URL}/products/${productId}/feedbacks`).pipe(
      map(data => data.map(item => new FeedbackModel().deserialize(item))),
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  createFeedbackForProductWithId(productId: string, newFeedback: FeedbackModel): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(`${this.SERVER_API_URL}/products/${productId}/feedbacks`, newFeedback).pipe(
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }
}
