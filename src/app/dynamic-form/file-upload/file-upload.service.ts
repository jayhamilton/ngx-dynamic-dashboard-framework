import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  apiurl = environment.apihost + environment.api;
  constructor(private http: HttpClient) {}

  upload(imageList: FileList): Observable<any> {
    console.log(imageList);

    const formData = new FormData();

    for (let x = 0; x < imageList.length; x++) {
      formData.append('images', imageList[x], imageList.item(x)?.name);
    }

    return this.http.post(this.apiurl, formData);
  }
}
