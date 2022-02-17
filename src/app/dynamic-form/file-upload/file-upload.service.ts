import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  apiEndPoint: string = environment.apihost + environment.imageAPI;
  constructor(private http: HttpClient) {}

  upload(imageList: FileList): Observable<any> {
    console.log(imageList);
    let apiToken = sessionStorage.getItem(environment.sessionToken);

    if (apiToken === null) {
      apiToken = '';
    }
    //skip will avoid the HttpInterceptor from adding the Content-Type header for upload given the Content-Type is not JSON but is binary.
    let headers = new HttpHeaders({
      skip: 'true',
      Authorization: apiToken,
    });

    const body = new FormData();

    for (let x = 0; x < imageList.length; x++) {
      body.append('images', imageList[x], imageList.item(x)?.name);
    }

    return this.http.post(this.apiEndPoint, body, { headers });
  }
}
