import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable, throwError } from 'rxjs';
import { EmployeeModel } from '../../models/employee.model';
import { catchError, map } from 'rxjs/operators';
import { CustomResponse, ErrorResponse } from '../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly SERVER_API_URL: string;

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.SERVER_API_URL = this.configService.get('API_URL');
  }

  getAllEmployees(): Observable<EmployeeModel[]> {
    return this.httpClient.get<EmployeeModel[]>(`${this.SERVER_API_URL}/employees`).pipe(
      map(data => data.map(item => new EmployeeModel().deserialize(item))),
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  createEmployee(newEmployee: EmployeeModel): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(`${this.SERVER_API_URL}/employees`, newEmployee).pipe(
      catchError((err: ErrorResponse) => throwError(err.message))
    );
  }

  getEmployee(id: string): Observable<EmployeeModel> {
    return this.httpClient.get<EmployeeModel>(`${this.SERVER_API_URL}/employees/${id}`).pipe(
      map(data => new EmployeeModel().deserialize(data)),
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  updateEmployee(updatedEmployee: EmployeeModel): Observable<CustomResponse> {
    return this.httpClient.put<CustomResponse>(`${this.SERVER_API_URL}/employees/${updatedEmployee._id}`, updatedEmployee).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }

  deleteEmployee(id: string): Observable<CustomResponse> {
    return this.httpClient.delete<CustomResponse>(`${this.SERVER_API_URL}/employees/${id}`).pipe(
      catchError((err: CustomResponse | ErrorResponse) => throwError(err.message))
    );
  }
}
