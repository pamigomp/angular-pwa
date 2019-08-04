import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
import { PushNotificationService } from './push-notification.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToasterComponent } from './toaster/toaster.component';
import { CheckForUpdateService } from './check-for-update.service';

@NgModule({
  declarations: [
    AppComponent,
    ToasterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    BrowserAnimationsModule
  ],
  providers: [DataService, PushNotificationService, CheckForUpdateService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
