import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ConfigService } from './services/config/config.service';
import { PushNotificationService } from './services/push-notification/push-notification.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckForUpdateService } from './services/check-for-update/check-for-update.service';
import { MaterialModule } from './material.module';
import { PushNotificationComponent } from './components/push-notification/push-notification.component';
import { UpdateNotificationComponent } from './components/update-notification/update-notification.component';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './auth.guard';
import { AuthService } from './services/auth/auth.service';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { TokenInterceptor } from './token.interceptor';
import { RegistrationComponent } from './components/registration/registration.component';
import { HomeComponent } from './components/home/home.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    PushNotificationComponent,
    UpdateNotificationComponent,
    LoginComponent,
    TodoListComponent,
    UserListComponent,
    RegistrationComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ['http://localhost:8080/api/v1'],
        blacklistedRoutes: ['http://localhost:8080/api/v1/auth']
      }
    }),
  ],
  providers: [ConfigService, PushNotificationService, CheckForUpdateService, AuthService, AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
