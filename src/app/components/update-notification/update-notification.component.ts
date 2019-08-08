import { Component, OnInit } from '@angular/core';
import { SwUpdate, UpdateActivatedEvent, UpdateAvailableEvent } from "@angular/service-worker";
import { CheckForUpdateService } from "../../services/check-for-update/check-for-update.service";
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from "@angular/material";

@Component({
  selector: 'app-update-notification',
  templateUrl: './update-notification.component.html',
  styleUrls: ['./update-notification.component.scss']
})
export class UpdateNotificationComponent implements OnInit {
  swUpdateEnabled = this.swUpdate.isEnabled;

  constructor(private swUpdate: SwUpdate,
              private checkForUpdateService: CheckForUpdateService,
              public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    if (this.swUpdateEnabled) {
      this.swUpdate.available.subscribe((event: UpdateAvailableEvent) => {
        console.log('[App] Update available: current version is', event.current, 'available version is', event.available);
        const snackBarRef: MatSnackBarRef<SimpleSnackBar> = this.snackBar.open(
          'Application update is available!',
          'Reload',
          {duration: 0}
        );
        snackBarRef.onAction().subscribe(() => {
          window.location.reload();
        });
      }, (err) => {
        console.error(err);
      });

      this.swUpdate.activated.subscribe((event: UpdateActivatedEvent) => {
        console.log('[App] Update activated: old version was', event.previous, 'new version is', event.current);
      });
    }
  }

  checkUpdate(): void {
    if (this.swUpdateEnabled) {
      console.log('[App] Checking update started');
      this.swUpdate.checkForUpdate().then(() => {
        console.log('[App] Checking update completed');
      }).catch(err => {
        console.error('[App] Checking update failed. Error:', err);
      });
    } else {
      this.snackBar.open('Your browser does not support update notifications!');
    }
  }

  activateUpdate(): void {
    if (this.swUpdateEnabled) {
      console.log('[App] Activate update started');
      this.swUpdate.activateUpdate().then(() => {
        console.log('[App] Activate update completed');
        window.location.reload();
      }).catch(err => {
        console.error('[App] Activate update failed. Error:', err);
      });
    } else {
      this.snackBar.open('Your browser does not support update notifications!');
    }
  }
}
