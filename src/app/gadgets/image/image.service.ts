import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {

  getImageLists(imageList: string) {

    let imgListArray = imageList.split(',');
    let columnStart = 0;
    let totalColumns = 3;
    let currentColumn = columnStart;

    let data: any[] = [];

    data.push({ imageNames: [] });
    data.push({ imageNames: [] });
    data.push({ imageNames: [] });

    imgListArray.forEach((image) => {
      if (currentColumn == totalColumns) {
        currentColumn = columnStart;
      }

      data[currentColumn].imageNames.push(image.trim());

      currentColumn++;
    });

    return data;
  }
}
