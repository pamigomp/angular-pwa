import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth/auth.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers: {
      [name: string]: string | string[];
    } = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    if (this.authService.isAuthenticated()) {
      headers.Authorization = `Bearer ${this.authService.getToken()}`;
    }
    request = request.clone({
      setHeaders: headers
    });
    return next.handle(request)
      .pipe(tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log(event);
        }
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          } else if ((err.status === 403)) {
            this.router.navigate(['/forbidden']);
          }
        }
      }));
  }
}
