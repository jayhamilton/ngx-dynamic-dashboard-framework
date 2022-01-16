import {
  Component,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { ImageComponent } from '../gadgets/image/image.component';
import { BoardGridDirective } from './boardgrid.directive';
import { ProductComponent } from '../gadgets/product/product.component';
import { IEvent, EventService } from '../eventservice/event.service';
import { BoardService, BoardType, IBoard } from './board.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { IGadget } from '../gadgets/common/gadget-common/gadget-base/gadget.model';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  animations: [
    trigger('showHide', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class BoardComponent implements OnInit {
  @ViewChild(BoardGridDirective, { static: true })
  gadgetGridHost!: BoardGridDirective;

  boardData!: IBoard;
  boardExists: boolean;
  boardHasGadgets: boolean;

  constructor(
    private eventService: EventService,
    private boardService: BoardService
  ) {
    this.boardExists = false;
    this.boardHasGadgets = false;
    this.setupBoardEventListeners();
  }

  ngOnInit(): void {
    this.displayLastSelectedBoard();
  }

  /**
   * Event Listners
   */
  setupBoardEventListeners() {
    this.eventService
      .listenForBoardCreatedCompleteEvent()
      .subscribe((event: IEvent) => {
        this.displayLastSelectedBoard();
      });

    this.eventService
      .listenForBoardDeletedCompleteEvent()
      .subscribe((event: IEvent) => {
        this.displayLastSelectedBoard();
      });

    this.eventService
      .listenForBoardSelectedEvent()
      .subscribe((event: IEvent) => {
        this.displayNavSelectedBoard(event.data); //boardId
      });

    this.eventService
      .listenForLibraryAddGadgetEvents()
      .subscribe((event: IEvent) => {
        /**
         * TODO - use different method here. We want to
         * save the board structure and reload it
         * instead of adding the gadget directly to the
         * display.
         */

        this.saveNewGadget(event.data); //IGadget
      });

    this.eventService.listenForGadgetDeleteEvent().subscribe((event) => {
      this.displayLastSelectedBoard();
    });
  }

  /**
   * Display last selected board
   * after the browser is launched or
   * if a new board is created. When a new board is created
   * that new board becomes the last selected board.
   */
  displayLastSelectedBoard() {
    //getBoardData
    this.boardService.getLastSelectedBoard().subscribe((boardData: IBoard) => {
      this.prepareBoardAndShow(boardData);
    });
  }

  /**
   * Display board based on navigation menu selection event
   */
  displayNavSelectedBoard(boardId: number) {
    //getBoardData
    this.boardService.getBoardById(boardId).subscribe((boardData: IBoard) => {
      this.prepareBoardAndShow(boardData);
    });
  }
  /**
   * Rudimentary board state management. this.boardData and this.boardExists
   * will determine what instructions/actions to display on the board.
   * @param boardData
   */
   prepareBoardAndShow(boardData: IBoard) {
    this.boardData = boardData;
    this.boardExists = this.doesABoardExist();
    this.boardHasGadgets = this.doesTheBoardHaveGadgets();

    this.clearDisplay();
    this.show();
  }

  /**
   *  walk the board structure to find gadgets to display
   */
  show() {
    //use this.boardData to render components
    this.boardData.rows.forEach((rowData) => {
      rowData.columns.forEach((columnData) => {
        columnData.gadgets.forEach((gadgetData) => {
          this.addGadget(gadgetData);
        });
      });
    });
  }

  /**
   * addGadget is directly called from the library add action. Otherwise
   * its is called when the board loads persisted data.
   * TODO - use differnet method when add gadget is requested from the library. For that event,
   * there should just be a board save action and then a reload of the board data.
   * @param gadgetData
   */
  public addGadget(gadgetData: IGadget) {
    const gridHost = this.gadgetGridHost.viewContainerRef;

    let gadgetRef = null;

    //TODO refactor and move to seperate clases
    switch (gadgetData.componentType) {
      case 'ProductComponent':
        gadgetRef = gridHost.createComponent(ProductComponent);
        break;
      case 'ImageComponent':
        gadgetRef = gridHost.createComponent(ImageComponent);
        break;
      default:
      //do nothing
    }

    if (gadgetRef) {
      gadgetRef.instance.setConfiguration(gadgetData);
    }
  }

  saveNewGadget(gadgetData: IGadget) {
    this.boardService.saveNewGadgetToBoard(this.boardData, gadgetData);
    this.displayLastSelectedBoard();
  }

  clearDisplay() {
    const gridHost = this.gadgetGridHost.viewContainerRef;
    gridHost.clear();
  }

  doesABoardExist() {
    return this.boardData.id != BoardType.EMPTYBOARDCOLLECTION; //TODO - Refactor this state. Move the state/condition from board to BoardCollection.
  }

  doesTheBoardHaveGadgets() {
    let gadgetCount = 0;
    this.boardData.rows.forEach((rowData) => {
      rowData.columns.forEach((columnData) => {
        gadgetCount += columnData.gadgets.length;
      });
    });

    return gadgetCount > 0;
  }
  openLibrary(){
    this.eventService.emitLibraryMenuOpenEvent();
  }

  drop(event: CdkDragDrop<string[]>) {

    return;

    console.log(event);

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
