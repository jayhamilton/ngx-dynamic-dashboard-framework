import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
import { NgClass, AsyncPipe } from '@angular/common';
import { GadgetGridCellHostComponent } from '../gadgets/gadget-grid-cell-host/gadget-grid-cell-host.component';
import { MatIcon } from '@angular/material/icon';
import { AnimationService } from '../animation/animation.service';
import { ThemeService } from '../theme/theme.service';

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
    imports: [MatTabGroup, MatTab, CdkDropListGroup, NgClass, CdkDropList, GadgetGridCellHostComponent, MatIcon, AsyncPipe]
})
export class BoardComponent implements OnInit {
  boardData!: IBoard;
  boardExists: boolean;
  boardHasGadgets: boolean;
  locked = false;

  constructor(
    private eventService: EventService,
    private boardService: BoardService,
    private layoutService: LayoutService,
    private animationService: AnimationService,
    private changeDetectorRef: ChangeDetectorRef,
    public themeService: ThemeService
  ) {
    this.boardExists = false;
    this.boardHasGadgets = false;
    this.setupBoardEventListeners();

    // Disabling a cdkDropList also disables dragging for the cdkDrag items
    // inside it, so this one flag is enough to freeze every gadget on the
    // board without touching each gadget component individually.
    this.boardService.locked$.subscribe((locked) => {
      this.locked = locked;
      this.scheduleDetectChanges();
    });
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
        this.applyLayoutChange(() =>
          this.layoutService.changeLayout(event, this.boardData)
        );
      });

    this.eventService
      .listenForBoardWidthChangeEvent()
      .subscribe((event: IEvent) => {
        this.applyLayoutChange(() =>
          this.layoutService.updateBoardWidth(this.boardData, event.data.contentWidth)
        );
      });

    this.eventService.listenForBoardAddRowEvent().subscribe(() => {
      this.applyLayoutChange(() => this.layoutService.addRow(this.boardData));
    });

    this.eventService.listenForBoardRemoveRowEvent().subscribe((event: IEvent) => {
      this.applyLayoutChange(() =>
        this.layoutService.removeRow(this.boardData, event.data.rowIndex)
      );
    });

    this.eventService.listenForBoardMoveRowEvent().subscribe((event: IEvent) => {
      this.applyLayoutChange(() =>
        this.layoutService.moveRow(
          this.boardData,
          event.data.previousIndex,
          event.data.currentIndex
        )
      );
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

    this.eventService.listenForGadgetMoveRequestEvent().subscribe((event: IEvent) => {
      this.moveGadget(event.data.instanceId, event.data.direction);
    });

    this.eventService.listenForBoardUpdateNameDescriptionRequestEvent().subscribe((event)=>{

      if (this.boardData.id === event.data['id']){
        this.boardData.description = event.data['description'];
        this.boardData.title = event.data['title'];
        this.scheduleDetectChanges();
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
    this.scheduleDetectChanges();
  }

  private detectChangesScheduled = false;

  /**
   * BoardComponent lives inside SidenavComponent's nested mat-drawer-
   * container structure. ApplicationRef.tick() (scheduled by EventService
   * on every emit) walks the tree from the root, but that Material
   * CDK-managed view container isn't reliably reached by it — this
   * mutation is otherwise invisible until something else happens to
   * trigger a check on this specific view.
   *
   * Calling detectChanges() synchronously here (instead of scheduling it,
   * like EventService does for the app-wide tick) checks this view before
   * the rest of the tree has settled, which trips the same dev-mode
   * "changed after checked" verification the synchronous version of this
   * fix caused in EventService — so this is deferred to a microtask too,
   * landing after the app-wide tick EventService already scheduled for
   * the same cascade.
   */
  private scheduleDetectChanges(): void {
    if (this.detectChangesScheduled) return;
    this.detectChangesScheduled = true;
    queueMicrotask(() => {
      this.detectChangesScheduled = false;
      this.changeDetectorRef.detectChanges();
    });
  }

  /**
   * Every row/layout mutation follows the same shape: record where the
   * gadgets are, change the board, re-render, then animate them from their
   * old positions to their new ones.
   *
   * detectChanges() in the middle is what makes the flip possible — the DOM
   * has to have actually moved before Flip can measure the new positions,
   * and the re-render would otherwise not happen until after this handler
   * returns.
   */
  private applyLayoutChange(mutate: () => void) {
    this.animationService.beginLayoutFlip();

    mutate();
    this.displayLastSelectedBoard();
    this.changeDetectorRef.detectChanges();

    this.animationService.completeLayoutFlip();
    this.announceRowsChanged();
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

  boardWidthClass() {
    return 'board-width-' + (this.boardData.contentWidth || 'normal');
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

  /**
   * Chat-driven equivalent of drop() above — same persistence call, but
   * triggered from EventService (cross-component) instead of a drag
   * gesture in this component's own template, so the view needs an
   * explicit refresh via scheduleDetectChanges() afterward.
   */
  private moveGadget(instanceId: number, direction: 'left' | 'right' | 'up' | 'down') {
    const location = this.findGadgetLocation(instanceId);
    if (!location) return;

    const { rowIndex, columnIndex, gadgetIndex } = location;
    const sourceColumn = this.boardData.rows[rowIndex].columns[columnIndex];

    let targetRowIndex = rowIndex;
    let targetColumnIndex = columnIndex;

    if (direction === 'left' || direction === 'right') {
      targetColumnIndex += direction === 'left' ? -1 : 1;
      const columnsInRow = this.boardData.rows[rowIndex].columns.length;
      if (targetColumnIndex < 0 || targetColumnIndex >= columnsInRow) return;
    } else {
      targetRowIndex += direction === 'up' ? -1 : 1;
      if (targetRowIndex < 0 || targetRowIndex >= this.boardData.rows.length) return;
      // A different row may have a different column count — land on the
      // nearest valid column rather than refusing the move.
      targetColumnIndex = Math.min(columnIndex, this.boardData.rows[targetRowIndex].columns.length - 1);
      if (targetColumnIndex < 0) return;
    }

    const targetColumn = this.boardData.rows[targetRowIndex].columns[targetColumnIndex];
    const [gadget] = sourceColumn.gadgets.splice(gadgetIndex, 1);
    targetColumn.gadgets.push(gadget);

    this.boardService.updateBoardDueToDragAndDrop(this.boardData);
    this.scheduleDetectChanges();
  }

  private findGadgetLocation(
    instanceId: number
  ): { rowIndex: number; columnIndex: number; gadgetIndex: number } | undefined {
    for (let rowIndex = 0; rowIndex < this.boardData.rows.length; rowIndex++) {
      const columns = this.boardData.rows[rowIndex].columns;
      for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        const gadgetIndex = columns[columnIndex].gadgets.findIndex((g) => g.instanceId === instanceId);
        if (gadgetIndex !== -1) return { rowIndex, columnIndex, gadgetIndex };
      }
    }
    return undefined;
  }
}
