// src/app/auth/token.interceptor.ts
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './_authentication/authentication.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthenticationService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //don't add headers for api requests such as file upload.
    if (request.headers.get('skip')) {
      return next.handle(request);
    }

    let token = sessionStorage.getItem(environment.sessionToken);
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: token,
          'Content-type': 'application/json',
          Accept: 'application/json',
        },
      });
    }
    return next.handle(request);
  }
}
