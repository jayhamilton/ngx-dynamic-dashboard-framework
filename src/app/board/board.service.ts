import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEvent, EventService } from '../eventservice/event.service';
import { IGadget } from '../gadgets/gadget.model';

export interface IBoardCollection {
  lastSelectedBoard: number;
  boardList: IBoard[];
}

export interface IBoard {
  title: string;
  description: string;
  structure: string;
  id: number;
  boardInstanceId: number;
  rows: IRow[];
}

export interface IRow {
  columns: IColumn[];
}

export interface IColumn {
  styleClass: string;
  gadgets: IGadget[];
  gadgetNames: string[];
}

enum BoardType {
  LASTSELECTED,
  ID,
}

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  BOARDCOLLECTION: string = 'boardCollection';
  initializingBoard: IBoard;

  constructor(private eventService: EventService) {
    this.initializingBoard = {
      title: '',
      description: '',
      structure: '',
      id: -10,
      boardInstanceId: -10,
      rows: [],
    };

    this.setupEventListeners();
  }

  /**
   * Event Listners
   */
  private setupEventListeners() {
    this.eventService
      .listenForBoardCreateRequestEvent()
      .subscribe((event: IEvent) => {
        this.createNewBoard(event);
      });

    this.eventService
      .listenForBoardDeleteRequestEvent()
      .subscribe((event: IEvent) => {
        this.deleteBoard(event);
      });

    this.eventService
      .listenForGadgetDeleteEvent()
      .subscribe((event: IEvent) => {
        this.deleteGadgetFromBoard(event);
      });
  }

  private read() {
    return localStorage.getItem(this.BOARDCOLLECTION);
  }

  private save(boardCollection: IBoardCollection) {
    localStorage.removeItem(this.BOARDCOLLECTION);
    localStorage.setItem(this.BOARDCOLLECTION, JSON.stringify(boardCollection));
  }

  private getBoardData(): IBoardCollection {
    if (this.read() == null) {
      return { lastSelectedBoard: -1, boardList: [] }; //TODO this will not work if there is additional default boards added. FIXME
    } else {
      let _data = this.read();
      if (_data == null) {
        _data = '';
      }
      return JSON.parse(_data);
    }
  }

  private getAllDefaultBoardData(): IBoard[] {
    return [
      {
        title: 'Board',
        description: '',
        structure: '1-1',
        id: -1,
        boardInstanceId: -1,
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
      },
    ];
  }

  private getDefaultBoard(type: number): IBoard {
    let defaultBoardsArray = this.getAllDefaultBoardData();
    return defaultBoardsArray[type]; //currently only one default board type which is 0 exists
  }

  public getBoardCollection() {
    return new Observable<IBoardCollection>((observer) => {
      observer.next(this.getBoardData());
      return () => {};
    });
  }

  public getLastSelectedBoard() {
    return this.getBoardByType(BoardType.LASTSELECTED, -1);
  }
  public getBoardById(boardId: number) {
    return this.getBoardByType(BoardType.ID, boardId);
  }

  private getBoardByType(type: BoardType, boardId: number) {
    return new Observable<IBoard>((observer) => {
      let data = this.getBoardData();

      if (data.boardList.length == 0) {
        observer.next(this.initializingBoard);
        return () => {};
      } else {
        //in case we cannot find the last selected return the first in the list.
        let boardToReturn = data.boardList[0];

        data.boardList.forEach((board) => {
          switch (type) {
            case BoardType.LASTSELECTED:
              {
                if (board.id == data.lastSelectedBoard) {
                  boardToReturn = board;
                }
              }
              break;
            case BoardType.ID:
              {
                if (board.id == boardId) {
                  boardToReturn = board;
                  this.setLastSelectedAndSaveBoard(boardId);
                }
              }
              break;
            default:
          }
        });
        observer.next(boardToReturn);
        return () => {};
      }
    });
  }

  private createNewBoard(event: IEvent): void {
    console.log('CREATE BOARD REQUEST PROCESS START');
    /**
     * TODO do the work using the board service and then
     * (0) retreive the current board data
     * (1) retrieve a default board instance
     * (2) update the default board data info from event/request
     * (3) set the last selected board property on the collection
     * (4) update the saved information with the new entry
     * (5) persist back to storage
     * () raise completion event or error event
     * */

    this.getBoardCollection().subscribe((boardCollection: IBoardCollection) => {
      //(1)
      let defaultBoardInstanceRequestData = this.getDefaultBoard(0); //currently only one default board type

      //(2)
      defaultBoardInstanceRequestData.id = Date.now();
      defaultBoardInstanceRequestData.title = event.data['title'];
      defaultBoardInstanceRequestData.description = event.data['description'];

      //(3)
      boardCollection.lastSelectedBoard = defaultBoardInstanceRequestData.id;

      //(4)
      boardCollection.boardList = [
        ...boardCollection.boardList,
        defaultBoardInstanceRequestData,
      ];

      //(5)
      this.save(boardCollection);

      //(6)
      this.eventService.emitBoardCreatedCompleteEvent({
        data: defaultBoardInstanceRequestData,
      });
      console.log('CREATE BOARD REQUEST PROCESS COMPLETE');
    });
  }

  private deleteBoard(event: IEvent) {
    console.log('DELETE BOARD REQUEST PROCESS START');
    /**
     * TODO do the work using the board service and then
     * (1) retreive the current board data
     * (2) find the board to delete
     * (3) if board is lastSelected set the last selected to another board???
     * (4) persist back to storage
     * (5) raise completion event or error event
     * */

    this.getBoardCollection().subscribe((boardCollection: IBoardCollection) => {
      let idx = boardCollection.boardList.findIndex(
        (board) => board.id === event.data['id']
      );

      boardCollection.boardList.splice(idx, 1);

      //todo - make a decision on what to set the lastBoardSelectionTo

      this.save(boardCollection);
    });

    this.eventService.emitBoardDeletedCompleteEvent({ data: event });

    console.log('DELETE BOARD REQUEST PROCESS COMPLETE');
  }

  public saveNewGadgetToBoard(
    incomingBoard: IBoard,
    incomingGadget: IGadget,
    rowNum: number,
    colNum: number
  ) {
    //walk the board data and find array of gadgets for the board.
    //place gadget in the left most column at the head.

    this.getBoardCollection().subscribe((boardCollection: IBoardCollection) => {
      boardCollection.boardList.forEach((board) => {
        if (board.id == incomingBoard.id) {
          let update: IGadget[] = [];

          //set instanceIdValue
          incomingGadget.instanceId = Date.now();

          update.push(incomingGadget);

          console.log(incomingGadget.instanceId);

          let totalColumns = board.rows.length;

          board.rows[rowNum].columns[this.columnToInsert].gadgets.forEach(
            (gadget) => {
              update.push(gadget);
            }
          );
          board.rows[rowNum].columns[this.columnToInsert].gadgets = update;
          if (this.columnToInsert < totalColumns) {
            this.columnToInsert++;
          } else {
            this.columnToInsert = 0;
          }
        }
      });

      this.save(boardCollection);
    });
  }

  columnToInsert: number = 0;//TODO - fix this during drag drop refactoring

  private setLastSelectedAndSaveBoard(boardId: number) {
    this.getBoardCollection().subscribe((boardCollection: IBoardCollection) => {
      boardCollection.lastSelectedBoard = boardId;
      this.save(boardCollection);
    });
  }

  private deleteGadgetFromBoard(eventDataGadgetInstanceId: IEvent) {
    this.getBoardCollection().subscribe((boardCollection: IBoardCollection) => {
      //find board
      boardCollection.boardList.forEach((board) => {
        board.rows.forEach((rowData) => {
          rowData.columns.forEach((columnData) => {
            let idx = columnData.gadgets.findIndex(
              (gadget) => gadget.instanceId === eventDataGadgetInstanceId.data
            );
            if (idx >= 0) {
              columnData.gadgets.splice(idx, 1);
              this.save(boardCollection);
            }
          });
        });
      });
    });
  }
}
