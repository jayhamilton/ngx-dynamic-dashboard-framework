
import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment'
import { IGadget } from '../gadgets/common/gadget-common/gadget-base/gadget.model';

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
        return this._http.get<IGadget[]>('/assets/api/' + libraryJson);
    }
  }
