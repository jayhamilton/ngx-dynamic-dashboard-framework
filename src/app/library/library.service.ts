
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment'

@Injectable()
export class LibraryService{
    env: any;

    constructor(private _http: HttpClient) {
        this.env = environment;
    }

    getLibrary() {
        let libraryJson = '';

        if (this.env.production == true) {
          libraryJson = 'library-prod.json';

        } else {
          libraryJson = 'library.json';
        }
        return this._http.get<LibraryModel>('/assets/api/' + libraryJson);
    }
  }
