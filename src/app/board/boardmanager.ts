import { Observable } from 'rxjs';
import { BoardService } from './board.service';
import { IBoard } from './board.service';

export interface IBoardManager {
  create(name: string): void;
  edit(name: string): void;
  delete(name: string): void;
  save(data: any): void;
  loadBoardData(): Observable<IBoard>;
}

export class BoardManager implements IBoardManager {
  constructor(private boardService: BoardService) {}

  loadBoardData() {
    return new Observable<IBoard>((observer) => {
      observer.next(this.boardService.getBoardData());
      return () => {};
    });
  }

  create(name: string): void {
    throw new Error('Method not implemented.');
  }
  edit(name: string): void {
    throw new Error('Method not implemented.');
  }
  delete(name: string): void {
    throw new Error('Method not implemented.');
  }
  save(data: any): void {
    throw new Error('Method not implemented.');
  }
}
