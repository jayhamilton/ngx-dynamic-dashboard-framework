import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropListGroup, CdkDropList } from '@angular/cdk/drag-drop';

import { IEvent, EventService } from '../eventservice/event.service';
import { BoardType, IBoard } from './board.model';
import { BoardService } from './board.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { IGadget } from '../gadgets/common/gadget-common/gadget-base/gadget.model';
import { UntypedFormControl } from '@angular/forms';
import { LayoutService } from '../layout/layout.service';
import { throttleTime } from 'rxjs/operators';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { NgClass } from '@angular/common';
import { GadgetGridCellHostComponent } from '../gadgets/gadget-grid-cell-host/gadget-grid-cell-host.component';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';

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
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatTabGroup, MatTab, CdkDropListGroup, NgClass, CdkDropList, GadgetGridCellHostComponent, MatCard, MatCardTitle, MatCardContent]
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
        this.announceRowsChanged();
      });

    this.eventService.listenForBoardAddRowEvent().subscribe(() => {
      this.layoutService.addRow(this.boardData);
      this.displayLastSelectedBoard();
      this.announceRowsChanged();
    });

    this.eventService.listenForBoardRemoveRowEvent().subscribe((event: IEvent) => {
      this.layoutService.removeRow(this.boardData, event.data.rowIndex);
      this.displayLastSelectedBoard();
      this.announceRowsChanged();
    });

    this.eventService.listenForBoardMoveRowEvent().subscribe((event: IEvent) => {
      this.layoutService.moveRow(
        this.boardData,
        event.data.previousIndex,
        event.data.currentIndex
      );
      this.displayLastSelectedBoard();
      this.announceRowsChanged();
    });

    this.eventService
      .listenForLibraryAddGadgetEvents()
      .pipe(throttleTime(1000))
      .subscribe((event: IEvent) => {
        this.saveNewGadget(event.data);
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

  /**
   * The layout panel keeps no board state of its own, so tell it the row
   * set changed and let it re-read from the board service.
   */
  private announceRowsChanged() {
    this.eventService.emitBoardRowsChangedEvent({
      data: { boardId: this.boardData?.id },
    });
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

  /** Unique per row+column — column index alone repeats across rows. */
  getColumnDropListId(rowIndex: number, columnIndex: number) {
    return 'r' + rowIndex + '-c' + columnIndex;
  }

  structureForRow(rowIndex: number) {
    return this.layoutService.structureForRow(this.boardData, rowIndex);
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
