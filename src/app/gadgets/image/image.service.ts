import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  public read() {
    return localStorage.getItem('plmBoard');
  }
  public write(boardData: any) {
    localStorage.removeItem('plmBoard');
    localStorage.setItem('plmBoard', JSON.stringify(boardData));
  }

  public getDefaultData() {
    let data = [
      {
        width: 30,
        gadgetNames: ['img1', 'img2'],
        gadgets: [
          {
            name: 'img1',
          },
          {
            name: 'img2',
          },
        ],
      },
      {
        width: 30,
        gadgetNames: ['img3', 'img4'],
        gadgets: [
          {
            name: 'img3',
          },
          {
            name: 'img4',
          },
        ],
      },
      {
        width: 30,
        gadgetNames: ['img5', 'img6'],
        gadgets: [
          {
            name: 'img5',
          },
          {
            name: 'img6',
          },
        ],
      },
    ];

    if (this.read() == null) {
      this.write(data);
    }

    let _data = this.read();
    if (_data == null) {
      _data = '';
    }

    return JSON.parse(_data);
  }
}
