import { Injectable } from '@angular/core';

export interface IBoard {
  title: string;
  description: string;
  structure: string;
  lastSelected: boolean;
  id: number;
  boardInstanceId: number;
  rows: any;
}

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  BOARD:string = "board"
  constructor() {}
  public read() {
    return localStorage.getItem(this.BOARD);
  }
  public save(boardData: any) {
    localStorage.removeItem(this.BOARD);
    localStorage.setItem(this.BOARD, JSON.stringify(boardData));
  }

  public getBoardData():IBoard[] {
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

  getDefaultBoardData():IBoard[] {
    return [{
      title: 'Board',
      description: '',
      structure: '1-1',
      lastSelected: true,
      id: -1,
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
    }];
  }
}
