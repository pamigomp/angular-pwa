import { Component, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { PushNotificationService } from './services/push-notification/push-notification.service';
import { CheckForUpdateService } from './services/check-for-update/check-for-update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly VAPID_PUBLIC_KEY = 'BMGa4HqOdJegpK4JH-XPbgZjAdBNGcI63SrBtRPwmUSiJddXiv8CLY0CYkRJT8Qiz7Ds2ja-P5rk3B-PHokxoAs';
  title = 'angular-pwa';
  updateAvailable = false;

  constructor(private swUpdate: SwUpdate,
              private checkForUpdateService: CheckForUpdateService,
              private swPush: SwPush,
              private pushService: PushNotificationService) {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        this.updateAvailable = true;
      });
    }
  }

  ngOnInit() {
    if (this.swPush.isEnabled) {
      this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      }).then((subscription: PushSubscription) => {
        this.pushService.createSubscription(subscription).subscribe();
      }).catch(err => console.error(`Could not subscribe to notifications. Error: ${err}`));

      this.swPush.notificationClicks.subscribe(event => {
        console.log('Received notification: ', event);
        const url = event.notification.data.url;
        window.open(url, '_blank');
      });
    }
  }

  unsubscribe() {
    if (this.swPush.isEnabled) {
      this.swPush.subscription.subscribe((subscription: PushSubscription) => {
        this.swPush.unsubscribe().then(() => {
          this.pushService.deleteSubscription(subscription).subscribe();
        }).catch((err) => console.log(err));
      });
    }
  }
}
