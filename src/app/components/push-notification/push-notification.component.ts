import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { PushNotificationService } from '../../services/push-notification/push-notification.service';
import { ConfigService } from '../../services/config/config.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { CustomResponse, ErrorResponse } from '../../models/response.model';

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss']
})
export class PushNotificationComponent implements OnInit {
  private swPushEnabled = this.swPush.isEnabled;

  constructor(private swPush: SwPush,
              private pushService: PushNotificationService,
              private configService: ConfigService,
              public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    if (this.swPushEnabled) {
      this.swPush.messages.subscribe(event => {
        console.log('Received notification: ', event);
      });

      this.swPush.notificationClicks.subscribe(event => {
        const url = event.notification.data.url;
        window.open(url, '_blank');
      });
    }
  }

  subscribe(): void {
    if (this.swPushEnabled) {
      // TODO Change to Modal
      const snackBarRef: MatSnackBarRef<SimpleSnackBar> = this.snackBar.open(
        'Are you sure you want to create push notification subscription?',
        'Yes',
        {duration: 0}
      );
      snackBarRef.onAction().subscribe(() => {
        this.createPushSubscription();
      });
    } else {
      this.snackBar.open('Your browser does not support push notifications!');
    }
  }

  unsubscribe(): void {
    if (this.swPushEnabled) {
      // TODO Change to Modal
      const snackBarRef: MatSnackBarRef<SimpleSnackBar> = this.snackBar.open(
        'Are you sure you want to delete your push notification subscription?',
        'Yes',
        {duration: 0}
      );
      snackBarRef.onAction().subscribe(() => {
        this.deletePushSubscription();
      });
    } else {
      this.snackBar.open('Your browser does not support push notifications!');
    }
  }

  private createPushSubscription(): void {
    this.swPush.requestSubscription({
      serverPublicKey: this.configService.get('VAPID_PUBLIC_KEY'),
    }).then((subscription: PushSubscription) => {
      this.pushService.createSubscription(subscription).subscribe((res: CustomResponse) => {
        console.log('[App] Create subscription request response:', res);
        this.snackBar.open('You are successfully subscribed');
      }, (err: ErrorResponse) => {
        console.error('[App] Create subscription request failed:', err);
      });
    }).catch(err => console.error('[App] Could not subscribe to push notifications. Error:', err));
  }

  private deletePushSubscription(): void {
    this.swPush.subscription.subscribe((subscription: PushSubscription) => {
      console.log('[App] Subscription:', subscription);
      if (subscription) {
        this.pushService.deleteSubscription(subscription).subscribe((res: CustomResponse) => {
          console.log('[App] Delete subscription request response:', res);
          this.snackBar.open('You are successfully unsubscribed!');
          subscription.unsubscribe().then((success: boolean) => {
            console.log('[App] Unsubscription successful:', success);
          }).catch(err => {
            console.error('[App] Unsubscription failed:', err);
          });
        }, (err: ErrorResponse) => {
          console.error('[App] Delete subscription request failed:', err);
        });
      } else {
        this.snackBar.open('You are not subscribed to push notifications!');
      }
    });
  }
}
