import { Observable } from 'rxjs';
import { IEvent,EventService } from '../eventservice/event.service';
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
  ) {

    this.setupConfigurationEventListeners();
  }

  /**
   * Event Listners
   */
  setupConfigurationEventListeners() {
    this.eventService
      .listenForBoardCreateRequestEvent()
      .subscribe((event: IEvent) => {
            this.create(event);
      });
  }

  /*
  setupNavigationEventListeners() {
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
    console.log("New Board Create Request Processing");
    /**
     * TODO do the work using the board service and then
     * (1) retreive the current board data
     * (2) retrieve a default board instance
     * (3) clear last selected property from (1)
     * (3) update the default board data info from event/request
     * (4) update the saved information with the new entry
     * (5) persist back to storage
     * (6) raise completion event or error event
     * raise a completed event or error event on the event service when done.
     * */

    this.loadBoardData().subscribe((savedBoardsData: IBoard[])=>{

      console.log ("BEFORE UPDATE");
      console.log (savedBoardsData);


      //(1)
      let defaultBoardsArray = this.boardService.getDefaultBoardData();
      let defaultBoardInstanceRequestData = defaultBoardsArray[0]; //currently only one default board type


      //(2)
      let editedSavedBoardsData = savedBoardsData.map( boardInstance=>{

        if(boardInstance.lastSelected === true){
          return {...boardInstance, lastSelected: false};
        }
        return boardInstance;
      });

      //(3)
      defaultBoardInstanceRequestData.lastSelected = true;
      defaultBoardInstanceRequestData.id = Date.now();
      defaultBoardInstanceRequestData.title = event.data['name'];
      defaultBoardInstanceRequestData.description = event.data['description'];


      //(4)
      let newBoardDataSet = [... editedSavedBoardsData, defaultBoardInstanceRequestData ];

      console.log("AFTER UPDATE");
      console.log(newBoardDataSet);


      //(5)
      this.boardService.save(newBoardDataSet);


      //(6)
      this.eventService.emitBoardCreatedCompleteEvent({ data:defaultBoardInstanceRequestData});


    });

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
