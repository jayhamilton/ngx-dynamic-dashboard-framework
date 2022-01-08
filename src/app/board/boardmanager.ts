import { Observable } from 'rxjs';
import { EventService } from '../eventservice/event.service';
import { IEvent } from '../menu/menu.event.model';
import { BoardService } from './board.service';
import { IBoard } from './board.service';

export interface IBoardManager {
  create(event: IEvent): void;
  edit(event: IEvent): void;
  delete(event: IEvent): void;
  save(event: IEvent): void;
  loadBoardData(): Observable<IBoard[]>;
}

export class BoardManager implements IBoardManager {
  constructor(
    private boardService: BoardService,
    private eventService: EventService
  ) {}

  /**
   * Event Listners
   */
  setupConfigurationTabsBoardRequestEventListener() {
    this.eventService
      .listenForConfigurationCompletedEvents()
      .subscribe((event: IEvent) => {
        const edata = event['data'];

        switch (event['name']) {
          case 'boardCreateRequestEvent':
            this.create(event);
            break;
          case 'boardEditRequestEvent':
            this.edit(event);
            break;
          case 'boardDeleteRequestEvent':
            this.delete(event);
            break;
        }
      });
  }

  /*
  setupBoardNavigationRequestEventListener() {
    this.eventService
      .listenForBoardNavigationCompletionEvents()
      .subscribe((event: IEvent) => {
        const edata = event['data'];

        switch (event['name']) {
          case 'boardSelected':
            this.displayBoard();
            break;
        }
      });
  }

  */

  //TODO - consider moving to the service given this will need to be retrieved via https.
  loadBoardData() {
    return new Observable<IBoard[]>((observer) => {
      observer.next(this.boardService.getBoardData());
      return () => {};
    });
  }

  create(event: IEvent): void {

    /**
     * TODO do the work using the board service and then
     * raise a completed event or error event on the event service when done.
     * */
    throw new Error('Method not implemented.');
  }
  edit(event: IEvent): void {
    throw new Error('Method not implemented.');
  }
  delete(event: IEvent): void {
    throw new Error('Method not implemented.');
  }
  save(event: IEvent): void {
    throw new Error('Method not implemented.');
  }
}
