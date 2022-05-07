import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthenticationService {
  apiEndPoint = environment.apihost + environment.loginAPI;

  constructor(private httpClient: HttpClient) { }

  authenticate(user: { userName: string; password: string }) {
    let headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(user.userName + ':' + user.password),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const body = { title: 'Angular POST Request Example' };

    return this.httpClient.post(this.apiEndPoint, body, {
      headers,
    });
  }
}
