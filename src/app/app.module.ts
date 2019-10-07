import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
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
import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth/auth.service';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './services/token.interceptor';
import { RegistrationComponent } from './components/registration/registration.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SidenavComponent } from './components/layout/sidenav/sidenav.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartComponent } from './components/cart/cart.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { CategoryComponent } from './components/category/category.component';
import { ProductComponent } from './components/product/product.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AddressFormComponent } from './components/cart/address-form/address-form.component';
import localePl from '@angular/common/locales/pl';
import { registerLocaleData } from '@angular/common';
import { MatPaginatorIntl } from '@angular/material';
import { PaginatorIntlService } from './services/paginator-intl.service';
import { DeviceDetectorModule } from 'ngx-device-detector';


registerLocaleData(localePl);

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    NotFoundComponent,
    PushNotificationComponent,
    RegistrationComponent,
    SidenavComponent,
    UpdateNotificationComponent,
    CartComponent,
    CategoryComponent,
    ProductComponent,
    ProfileComponent,
    AddressFormComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    MatCarouselModule,
    MaterialModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    DeviceDetectorModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ['http://localhost:8080/api/v1'],
        blacklistedRoutes: ['http://localhost:8080/api/v1/auth']
      }
    }),
    LayoutModule
  ],
  providers: [
    ConfigService,
    PushNotificationService,
    CheckForUpdateService,
    AuthService,
    AuthGuard, {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }, {
      provide: LOCALE_ID,
      useValue: 'pl-PL'
    }, {
      provide: MatPaginatorIntl,
      useClass: PaginatorIntlService
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
