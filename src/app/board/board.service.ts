import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class BoardService {

  apiUrl : string = 'board';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor( private http: HttpClient) { }

  getByName(name:string){
    return this.http.get(`${this.apiUrl}`);
  }


}
