import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private SERVER_API_URL: string;

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.SERVER_API_URL = this.configService.get('API_URL');
  }

  createSubscription(subscription: PushSubscription) {
    return this.httpClient.post(`${this.SERVER_API_URL}/subscribe`, subscription);
  }

  deleteSubscription(subscription: PushSubscription) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: subscription,
    };
    return this.httpClient.delete(`${this.SERVER_API_URL}/unsubscribe`, options);
  }
}
