import {Component, OnInit} from '@angular/core';
import {SwPush, SwUpdate} from '@angular/service-worker';
import {DataService} from './data.service';
import {PushNotificationService} from './push-notification.service';

const VAPID_PUBLIC = 'BMGa4HqOdJegpK4JH-XPbgZjAdBNGcI63SrBtRPwmUSiJddXiv8CLY0CYkRJT8Qiz7Ds2ja-P5rk3B-PHokxoAs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-pwa';
  joke: any;

  constructor(private swUpdate: SwUpdate, private data: DataService, private swPush: SwPush, private pushService: PushNotificationService) {
  }

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe((event) => {
        this.swUpdate.activateUpdate().then(() => document.location.reload());
      });
    }
    if (this.swPush.isEnabled) {
      this.swPush.requestSubscription({
        serverPublicKey: VAPID_PUBLIC,
      }).then(subscription => {
        console.log(subscription);
        this.pushService.createSubscription(subscription).subscribe();
      }).catch(err => console.error(`Could not subscribe to notifications. Error: ${err}`));
    }

    this.data.gimmeJokes().subscribe((res) => {
      this.joke = res;
    });
  }
}
