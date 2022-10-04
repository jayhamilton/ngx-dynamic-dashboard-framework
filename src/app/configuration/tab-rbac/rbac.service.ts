import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface IUser {
  id: number;
  username: string;
  roles: string;
}
@Injectable()
export class RBACUserService {
  apiEndPoint = environment.apihost + environment.userAPI;

  constructor(private httpClient: HttpClient) { }

  getUsers() {
    
    let sessionKey = sessionStorage.getItem(environment.sessionToken);
    
    let headers = new HttpHeaders({
      Authorization: '' + sessionKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const body = { title: 'Angular Get Request Example' };

    return this.httpClient.get<IUser[]>(this.apiEndPoint, {
      headers,
    });
  }

  createUser(name: string, roles: string) {
    
    let sessionKey = sessionStorage.getItem(environment.sessionToken);
    
    let headers = new HttpHeaders({
      Authorization: '' + sessionKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const body = { 'username': name, 'roles': roles};

    return this.httpClient.post<string>(this.apiEndPoint, body, {
      headers,
    });
  }
}
