import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IEvent, EventService } from '../eventservice/event.service';
import {
  IGadget,
  IPropertyPage,
} from '../gadgets/common/gadget-common/gadget-base/gadget.model';
import { LayoutType } from '../layout/layout.model';
import {
  BoardType,
  Hiearchy,
  IBoard,
  IBoardCollection,
  ITab,
} from './board.model';

//TODO - break this up into multipe service. The file is approaching 400 lines.

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  BOARDCOLLECTION: string = 'boardCollection';
  emptyBoardCollectionObject: IBoard;

  constructor(private eventService: EventService) {
    this.emptyBoardCollectionObject = {
      title: '',
      description: '',
      structure: '',
      id: BoardType.EMPTYBOARDCOLLECTION,
      relationship: Hiearchy.PARENT,
      tabs: [],
      rows: [],
    };

    this.setupEventListeners();
  }

  public getBoardCollection() {
    return new Observable<IBoardCollection>((observer) => {
      observer.next(this.getBoardCollectionFromSource());
      return () => {};
    });
  }

  public getLastSelectedBoard() {
    return this.getBoardByType(BoardType.LASTSELECTED, -1);
  }

  public getBoardById(boardId: number) {
    return this.getBoardByType(BoardType.IDSELECTED, boardId);
  }

  /**
   *  TODO Refactor saveGadgetToBoard
   * walk the board data and find array of gadgets for the board.
   * Place gadget in the left most column at the head.
   */

  public saveNewGadgetToBoard(incomingBoard: IBoard, incomingGadget: IGadget) {
    this.getBoardCollection().subscribe((boardCollection: IBoardCollection) => {
      boardCollection.boardList.forEach((board) => {
        if (board.id == incomingBoard.id) {
          let updatedGadgetList: IGadget[] = [];

          //set instanceIdValue
          incomingGadget.instanceId = Date.now();

          updatedGadgetList.push(incomingGadget);

          //pick an empty column to insert the gadget into
          let gadgetAdded = false;
          board.rows[0].columns.forEach((column) => {
            if (column.gadgets && column.gadgets.length === 0) {
              //add gadget here

              if(gadgetAdded == false){
                column.gadgets = updatedGadgetList;
                gadgetAdded = true;
              }
            }
          });

          //if no empty column found then insert in the first column
          if (gadgetAdded == false) {
            //add the gadget to the first available column
            board.rows[0].columns[0].gadgets.forEach((gadget) => {
              updatedGadgetList.push(gadget);
            });

            board.rows[0].columns[0].gadgets = updatedGadgetList;
          }
        }
      });

      this.saveBoardCollectionToDestination(boardCollection);
    });
  }

  public updateBoardDueToLayoutChange(incomingBoard: IBoard) {
    this.getBoardCollection().subscribe((boardCollection: IBoardCollection) => {
      boardCollection.boardList.forEach((board) => {
        if (board.id == incomingBoard.id) {
          board.rows = [];
          board.rows = [...incomingBoard.rows];
          board.structure = incomingBoard.structure;
        }
      });
      this.saveBoardCollectionToDestination(boardCollection);
    });
  }

  public updateBoardDueToDragAndDrop(incomingBoard: IBoard) {
    this.getBoardCollection().subscribe((boardCollection: IBoardCollection) => {
      boardCollection.boardList.forEach((board) => {
        if (board.id == incomingBoard.id) {
          board.rows = [];
          board.rows = [...incomingBoard.rows];
        }
      });
      this.saveBoardCollectionToDestination(boardCollection);
    });
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
      .listenForBoardUpdateNameDescriptionRequestEvent()
      .subscribe((event: IEvent) => {
        this.updateBoard(event);
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

  private saveBoardCollectionToDestination(boardCollection: IBoardCollection) {
    
    if(environment.useDBForBoardStorage){


    }else{
      localStorage.removeItem(this.BOARDCOLLECTION);
      localStorage.setItem(this.BOARDCOLLECTION, JSON.stringify(boardCollection));

    }
    
  }

  private getBoardCollectionFromSource(): IBoardCollection {
    let _data;
    
    if(environment.useDBForBoardStorage){


    }else{

      _data = localStorage.getItem(this.BOARDCOLLECTION);
    
    }
    
    if (_data == null) {
      return { lastSelectedBoard: -1, boardList: [] };
    } else {
      return JSON.parse(_data);
    }
  }

  private updateBoardsLayout(board: IBoard, layout: LayoutType) {
    //adjust the  columns to reflect the new layout.
    // either create two columns or three columns
  }

  private getAllDefaultBoards(): IBoard[] {
    return [
      {
        title: 'Board',
        description: '',
        structure: LayoutType.TWO_COL_EQUAL,
        id: BoardType.DEFAULT,
        tabs: [{ title: 'Board', id: BoardType.DEFAULT }],
        relationship: Hiearchy.PARENT,
        rows: [
          {
            columns: [
              {
                gadgets: [],
              },
              {
                gadgets: [],
              },
            ],
          },
        ],
      },
    ];
  }

  private getDefaultBoard(type: number): IBoard {
    let defaultBoardsArray = this.getAllDefaultBoards();
    return defaultBoardsArray[type]; //currently only one default board type which is 0 exists
  }

  private getBoardByType(type: BoardType, boardId: number) {
    return new Observable<IBoard>((observer) => {
      let data = this.getBoardCollectionFromSource();

      if (data.boardList.length == 0) {
        observer.next(this.emptyBoardCollectionObject);
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
            case BoardType.IDSELECTED:
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
    this.getBoardCollection().subscribe((boardCollection: IBoardCollection) => {
      let newBoard = this.getDefaultBoard(0); //currently only one default board type

      newBoard.id = Date.now();
      newBoard.title = event.data['title'];
      newBoard.description = event.data['description'];
      newBoard.relationship = Hiearchy.PARENT;

      let tabs: ITab[] = [];
      tabs.push({ title: event.data['title'], id: newBoard.id });

      if (event.data['tabvalue'] != null) {
        let tabId = event.data['tabvalue'];
        let idx = boardCollection.boardList.findIndex(
          (board) => board.id == tabId
        );
        let childBoard = boardCollection.boardList[idx];

        tabs.push({ title: childBoard.title, id: tabId });

        childBoard.relationship = Hiearchy.CHILD;
        childBoard.tabs = tabs;
      }

      newBoard.tabs = tabs;

      boardCollection.lastSelectedBoard = newBoard.id;

      boardCollection.boardList = [...boardCollection.boardList, newBoard];

      this.saveBoardCollectionToDestination(boardCollection);

      this.eventService.emitBoardCreatedCompleteEvent({
        data: newBoard,
      });
    });
  }

  private updateBoard(event: IEvent){

    console.log("Logic for updating the board");

    this.getBoardCollection().subscribe((boardCollection: IBoardCollection) => {
      boardCollection.boardList.forEach((board) => {
        if (board.id == event.data['id']) {

          console.log("found board with id: " + event.data['id']);
          board.title = event.data['title'];
          board.description = event.data['description'];
        }
      });
      this.saveBoardCollectionToDestination(boardCollection);
    });



  }
  private deleteBoard(event: IEvent) {
    this.getBoardCollection().subscribe((boardCollection: IBoardCollection) => {
      let idx = boardCollection.boardList.findIndex(
        (board) => board.id === event.data['id']
      );

      boardCollection.boardList.splice(idx, 1);

      /**
        If the last selected board is the item being deleted
        adjust the lastselected to the most recently created
        TODO maintain a list of 5 most recently last selected
      */

      if (event.data['id'] === boardCollection.lastSelectedBoard) {
        let mostRecentlyCreated = 0;

        boardCollection.boardList.forEach((board) => {
          if (mostRecentlyCreated < board.id) {
            mostRecentlyCreated = board.id;
          }
        });

        boardCollection.lastSelectedBoard = mostRecentlyCreated;
      }

      this.updateRelationshipForBoardsImpactedByTheDeletedBoard(
        boardCollection,
        event.data['id']
      );

      this.saveBoardCollectionToDestination(boardCollection);
    });

    this.eventService.emitBoardDeletedCompleteEvent({ data: event });
  }

  /**
   *
   * @param parentId TODO
   * @param childId
   */
  removeChildRelationshipFromParent(parentId: number, childId: number) {}

  /**
   * finds and updates the relationships for the deleted board
   * @param boardClollection
   * @param boardId
   */
  updateRelationshipForBoardsImpactedByTheDeletedBoard(
    boardClollection: IBoardCollection,
    deletedBoardId: number
  ) {
    boardClollection.boardList.forEach((board) => {
      let idx = 0;
      board.tabs.forEach((tab) => {
        if (tab.id == deletedBoardId) {
          board.tabs.splice(idx, 1);
          board.relationship = Hiearchy.PARENT;
        }
        idx++;
      });
    });
  }

  private setLastSelectedAndSaveBoard(boardId: number) {
    this.getBoardCollection().subscribe((boardCollection: IBoardCollection) => {
      boardCollection.lastSelectedBoard = boardId;
      this.saveBoardCollectionToDestination(boardCollection);
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
              this.saveBoardCollectionToDestination(boardCollection);
            }
          });
        });
      });
    });
  }

  public savePropertyPageConfigurationToDestination(
    gadgetPropertiesAsJSON: string,
    instanceId: number
  ) {
    this.getBoardCollection().subscribe((boardCollection: IBoardCollection) => {
      boardCollection.boardList.forEach((board) => {
        board.rows.forEach((row) => {
          row.columns.forEach((column) => {
            column.gadgets.forEach((gadget) => {
              if (gadget.instanceId === instanceId) {
                this.updateProperties(gadgetPropertiesAsJSON, gadget);
                this.saveBoardCollectionToDestination(boardCollection);
              }
            });
          });
        });
      });
    });
  }

  public updateProperties(gadgetPropertiesAsJSON: string, gadget: IGadget) {
    const updatedPropsObject = JSON.parse(gadgetPropertiesAsJSON);

    gadget.propertyPages.forEach(function (propertyPage: IPropertyPage) {
      for (let x = 0; x < propertyPage.properties.length; x++) {
        for (const prop in updatedPropsObject) {
          if (updatedPropsObject.hasOwnProperty(prop)) {
            if (prop === propertyPage.properties[x].key) {
              propertyPage.properties[x].value = updatedPropsObject[prop];

              //save common gadget properties like title here.
              if (prop === 'title') {
                gadget.title = updatedPropsObject[prop];
                gadget.propertyPages[0].properties[0].value =
                  updatedPropsObject[prop];
              }

              //save common gadget properties like title here.
              if (prop === 'subtitle') {
                gadget.subtitle = updatedPropsObject[prop];
                gadget.propertyPages[0].properties[1].value =
                  updatedPropsObject[prop];
              }

              //todo iterate the object to find the correct item
              if (prop === 'file-list') {
                gadget.propertyPages[1].properties[0].value =
                  updatedPropsObject[prop];
              }
            }
          }
        }
      }
    });
  }
}
