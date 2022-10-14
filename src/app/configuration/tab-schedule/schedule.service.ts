import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface IScheduledEvent {
  id: number;
  description: string;
  datetime: string;
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

    return this.httpClient.get<IScheduledEvent[]>(this.apiEndPoint, {
      headers,
    });
  }

  createEvent(description: string, datetime: string) {

    let sessionKey = sessionStorage.getItem(environment.sessionToken);

    let headers = new HttpHeaders({
      Authorization: '' + sessionKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const body = { 'description': description, 'datetime': datetime };

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


  updateEvent(id: number, description: string, datetime: string) {

    let sessionKey = sessionStorage.getItem(environment.sessionToken);

    let headers = new HttpHeaders({
      Authorization: '' + sessionKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const body = { 'description': description, 'datetime': datetime };

    return this.httpClient.put<string>(this.apiEndPoint + '/' + id, body, {
      headers,
    });
  }



}
