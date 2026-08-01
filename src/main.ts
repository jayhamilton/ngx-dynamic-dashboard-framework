import { enableProdMode, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './app/app.interceptor';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeModule } from './app/home/home.module';
import { LoginModule } from './app/login/login.module';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, BrowserAnimationsModule, HomeModule, LoginModule),
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    ]
})
  .catch(err => console.error(err));
