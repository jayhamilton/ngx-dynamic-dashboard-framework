import { Injectable } from '@angular/core';

export interface IBoard {
  title: string;
  structure: string;
  id: number;
  boardInstanceId: number;
  rows: any;
}

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor() {}
  public read() {
    return localStorage.getItem('plmBoard');
  }
  public write(boardData: any) {
    localStorage.removeItem('plmBoard');
    localStorage.setItem('plmBoard', JSON.stringify(boardData));
  }

  public getBoardData<IBoard>() {
    if (this.read() == null) {
      return this.getDefaultBoardData();
    } else {
      let _data = this.read();
      if (_data == null) {
        _data = '';
      }
      return JSON.parse(_data);
    }
  }

  getDefaultBoardData() {
    return {
      title: 'Board',
      structure: '1-1',
      id: 5,
      boardInstanceId: 0,
      rows: [
        {
          columns: [
            {
              styleClass: '1fr',
              gadgets: [],
              gadgetNames: [],
            },
            {
              styleClass: '1fr',
              gadgets: [],
              gadgetNames: [],
            },
          ],
        },
      ],
    };
  }
}
