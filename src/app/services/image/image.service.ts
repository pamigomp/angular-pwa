import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable, throwError } from 'rxjs';
import { ImageModel } from '../../models/image.model';
import { catchError, map } from 'rxjs/operators';
import { CustomResponse, ErrorResponse } from '../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly SERVER_API_URL: string;

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.SERVER_API_URL = this.configService.get('API_URL');
  }

  getImage(id: string): Observable<ImageModel> {
    return this.httpClient.get<ImageModel>(`${this.SERVER_API_URL}/images/${id}`).pipe(
      map(data => new ImageModel().deserialize(data)),
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  updateImage(updatedImage: ImageModel): Observable<CustomResponse> {
    return this.httpClient.put<CustomResponse>(`${this.SERVER_API_URL}/images/${updatedImage._id}`, updatedImage).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  deleteImage(id: string): Observable<CustomResponse> {
    return this.httpClient.delete<CustomResponse>(`${this.SERVER_API_URL}/images/${id}`).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  getAllImagesForProductWithId(productId: string): Observable<ImageModel[]> {
    return this.httpClient.get<ImageModel[]>(`${this.SERVER_API_URL}/products/${productId}/images`).pipe(
      map(data => data.map(item => new ImageModel().deserialize(item))),
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  createImageForProductWithId(productId: string, newImage: ImageModel): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(`${this.SERVER_API_URL}/products/${productId}/images`, newImage).pipe(
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }
}
