import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface IUser {
  id: number;
  username: string;
  roles: string;
}
@Injectable()
export class UserService {
  apiEndPoint = environment.apihost + environment.userAPI;

  constructor(private httpClient: HttpClient) { }

  getUsers(sortKey: string, sortOrder: string) {

    let queryParams = new HttpParams();
    queryParams = queryParams.append("sortKey", sortKey);
    queryParams = queryParams.append("sortOrder", sortOrder);

    let sessionKey = sessionStorage.getItem(environment.sessionToken);

    let headers = new HttpHeaders({
      Authorization: '' + sessionKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const body = { title: 'Angular Get Request Example' };

    return this.httpClient.get<IUser[]>(this.apiEndPoint, {
      headers: headers, params: queryParams
    });
  }

  createUser(name: string, roles: string) {

    let sessionKey = sessionStorage.getItem(environment.sessionToken);

    let headers = new HttpHeaders({
      Authorization: '' + sessionKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const body = { 'username': name, 'roles': roles };

    return this.httpClient.post<string>(this.apiEndPoint, body, {
      headers,
    });
  }

  updateUser(id: number, name: string, roles: string) {

    let sessionKey = sessionStorage.getItem(environment.sessionToken);

    let headers = new HttpHeaders({
      Authorization: '' + sessionKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const body = { 'username': name, 'roles': roles };

    return this.httpClient.put<string>(this.apiEndPoint + '/' + id, body, {
      headers,
    });
  }


  deleteUser(id: number) {

    let sessionKey = sessionStorage.getItem(environment.sessionToken);

    let headers = new HttpHeaders({
      Authorization: '' + sessionKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });


    return this.httpClient.delete<string>(this.apiEndPoint + '/' + id, {
      headers,
    });
  }
}
