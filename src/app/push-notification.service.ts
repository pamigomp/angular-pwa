import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const SERVER_API_URL = 'http://localhost:8080/api/v1';

@Injectable()
export class PushNotificationService {
  constructor(private http: HttpClient) {
  }

  public createSubscription(subscription: PushSubscription) {
    return this.http.post(`${SERVER_API_URL}/subscribe`, subscription);
  }

  public deleteSubscription(subscription: PushSubscription) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: subscription,
    };
    return this.http.delete(`${SERVER_API_URL}/unsubscribe`, options);
  }
}
