import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { IEvent, EventService } from '../eventservice/event.service';
import { BoardType, IBoard } from './board.model';
import { BoardService } from './board.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { IGadget } from '../gadgets/common/gadget-common/gadget-base/gadget.model';
import { UntypedFormControl } from '@angular/forms';
import { LayoutService } from '../layout/layout.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
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
  boardData!: IBoard;
  boardExists: boolean;
  boardHasGadgets: boolean;

  constructor(
    private eventService: EventService,
    private boardService: BoardService,
    private layoutService: LayoutService
  ) {
    this.boardExists = false;
    this.boardHasGadgets = false;
    this.setupBoardEventListeners();
  }

  selected = new UntypedFormControl(0);
  tabtitle: string = '';

  setSelected(val: number) {
    if (val < 0) {
      return;
    }
    this.displayNavSelectedBoard(this.boardData.tabs[val].id);
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
      .listenForLayoutChangeEvent()
      .subscribe((event: IEvent) => {
        this.layoutService.changeLayout(event, this.boardData);

        this.displayLastSelectedBoard();
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

      this.eventService.listenForGadgetPropertyChangeEvents()
      .subscribe((event:IEvent)=>{
        this.displayLastSelectedBoard();
      });

    this.eventService.listenForGadgetDeleteEvent().subscribe((event) => {
      this.displayLastSelectedBoard();
    });

    this.eventService.listenForBoardUpdateNameDescriptionRequestEvent().subscribe((event)=>{

      if (this.boardData.id === event.data['id']){
        this.boardData.description = event.data['description'];
        this.boardData.title = event.data['title'];
      }
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
  }

  saveNewGadget(gadgetData: IGadget) {
    this.boardService.saveNewGadgetToBoard(this.boardData, gadgetData);
    this.displayLastSelectedBoard();
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
  openLibrary() {
    this.eventService.emitLibraryMenuOpenEvent();
  }

  getColumnIndexAsString(idx: number) {
    return '' + idx;
  }

  drop(event: CdkDragDrop<IGadget[]>) {
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

    this.boardService.updateBoardDueToDragAndDrop(this.boardData);
  }
}
