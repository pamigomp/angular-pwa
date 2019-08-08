import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from './services/config/config.service';
import { PushNotificationService } from './services/push-notification/push-notification.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToasterComponent } from './components/toaster/toaster.component';
import { CheckForUpdateService } from './services/check-for-update/check-for-update.service';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    ToasterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    BrowserAnimationsModule
  ],
  providers: [ConfigService, PushNotificationService, CheckForUpdateService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
