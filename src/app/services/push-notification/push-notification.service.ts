import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private SERVER_API_URL: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.SERVER_API_URL = this.configService.get('API_URL');
  }

  public createSubscription(subscription: PushSubscription) {
    return this.http.post(`${this.SERVER_API_URL}/subscribe`, subscription);
  }

  public deleteSubscription(subscription: PushSubscription) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: subscription,
    };
    return this.http.delete(`${this.SERVER_API_URL}/unsubscribe`, options);
  }
}
