import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface IEvent {
  id: number;
  description: string;
  time: string;
}
@Injectable()
export class ScheduleService {
  apiEndPoint = environment.apihost + environment.eventAPI;

  constructor(private httpClient: HttpClient) { }

  getEvents() {
    
    let sessionKey = sessionStorage.getItem(environment.sessionToken);
    
    let headers = new HttpHeaders({
      Authorization: '' + sessionKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const body = { title: 'Angular Get Request Example' };

    return this.httpClient.get<IEvent[]>(this.apiEndPoint, {
      headers,
    });
  }

  createEvent(name: string, roles: string) {
    
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


  deleteEvent(id: number) {
    
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
