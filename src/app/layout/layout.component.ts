import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BoardService } from '../board/board.service';
import { IBoard } from '../board/board.model';
import { EventService } from '../eventservice/event.service';
import { layouts, LayoutType, boardWidths, BoardWidth } from './layout.model';
import { LayoutService } from './layout.service';
import { NgClass } from '@angular/common';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { CdkDropList, CdkDrag, CdkDragHandle, CdkDragDrop } from '@angular/cdk/drag-drop';

interface IRowSummary {
  index: number;
  structure: string;
  columnCount: number;
  gadgetCount: number;
}

@Component({
    selector: 'app-sidelayout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgClass, MatIconButton, MatButton, MatIcon, MatTooltip, MatTabGroup, MatTab, CdkDropList, CdkDrag, CdkDragHandle]
})
export class SidelayoutComponent implements OnInit {
  _layouts = layouts;
  selectedLayoutId = -1;

  _boardWidths = boardWidths;
  selectedWidth: BoardWidth = BoardWidth.NORMAL;

  rows: IRowSummary[] = [];
  selectedRowIndex = 0;

  constructor(
    private eventService: EventService,
    private boardService: BoardService,
    private layoutService: LayoutService
  ) {
    // Seed from whichever board is already active — the initial default board
    // on app load never fires a BoardSelectedEvent (that only happens when the
    // user clicks a board in the nav list), so without this the panel would
    // show nothing selected until the user switched boards.
    boardService.getLastSelectedBoard().subscribe((board) => {
      this.applyBoard(board, true);
    });

    eventService.listenForBoardSelectedEvent().subscribe((event) => {
      boardService.getBoardById(event.data).subscribe((board) => {
        this.applyBoard(board, true);
      });
    });

    // A newly created board becomes the last selected board, but that
    // happens after the constructor's initial (pre-creation) read — without
    // this the row list stays empty until some other event (row
    // add/remove/move, or switching boards) happens to trigger a refresh.
    eventService.listenForBoardCreatedCompleteEvent().subscribe(() => {
      boardService.getLastSelectedBoard().subscribe((board) => {
        this.applyBoard(board, true);
      });
    });

    // Rows added/removed, or a row's layout changed — re-read to stay in sync.
    eventService.listenForBoardRowsChangedEvent().subscribe(() => {
      boardService.getLastSelectedBoard().subscribe((board) => {
        this.applyBoard(board, false);
      });
    });
  }

  ngOnInit(): void {}

  get selectedRow(): IRowSummary | undefined {
    return this.rows[this.selectedRowIndex];
  }

  get canRemoveRow(): boolean {
    return this.rows.length > 1;
  }

  selectRow(index: number) {
    this.selectedRowIndex = index;
    this.syncSelectedLayoutToRow();
  }

  addRow() {
    // Target the row about to be appended so the layout thumbnails apply to
    // it straight away. This has to happen *before* the emit: the event is
    // synchronous, so the board applies the row and calls back into
    // applyBoard() during the emit, and anything set afterwards would be
    // read against a stale row count.
    this.selectedRowIndex = this.rows.length;
    this.eventService.emitBoardAddRowEvent();
  }

  dropRow(event: CdkDragDrop<IRowSummary[]>) {
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;
    if (previousIndex === currentIndex) return;

    // Keep whichever row was selected selected after the move. Set this
    // before emitting: the event is synchronous, so applyBoard() runs during
    // the emit and would otherwise reconcile against a stale index.
    this.selectedRowIndex = this.indexAfterMove(
      this.selectedRowIndex,
      previousIndex,
      currentIndex
    );

    this.eventService.emitBoardMoveRowEvent({
      data: { previousIndex, currentIndex },
    });
  }

  /** Where `index` ends up once the row at `from` is re-inserted at `to`. */
  private indexAfterMove(index: number, from: number, to: number): number {
    if (index === from) return to;
    if (from < index && to >= index) return index - 1;
    if (from > index && to <= index) return index + 1;
    return index;
  }

  removeRow(index: number, event: MouseEvent) {
    // The delete control sits inside the clickable row, so stop the click
    // from also selecting the row being removed.
    event.stopPropagation();
    if (!this.canRemoveRow) return;
    this.eventService.emitBoardRemoveRowEvent({ data: { rowIndex: index } });
  }

  selectBoardLayout(structure: LayoutType, layoutId: number) {
    this.selectedLayoutId = layoutId;
    this.eventService.emitLayoutChange({
      data: { structure, rowIndex: this.selectedRowIndex },
    });
  }

  selectBoardWidth(contentWidth: BoardWidth) {
    this.selectedWidth = contentWidth;
    this.eventService.emitBoardWidthChangeEvent({ data: { contentWidth } });
  }

  private applyBoard(board: IBoard, resetSelection: boolean) {
    if (!board) return;

    this.selectedWidth = (board.contentWidth as BoardWidth) || BoardWidth.NORMAL;

    const boardRows = board.rows || [];
    this.rows = boardRows.map((row, index) => {
      const structure = this.layoutService.structureForRow(board, index);
      return {
        index,
        structure,
        columnCount: row.columns?.length ?? LayoutService.columnCountFor(structure),
        gadgetCount: (row.columns || []).reduce(
          (total, column) => total + (column.gadgets?.length ?? 0),
          0
        ),
      };
    });

    if (resetSelection) {
      this.selectedRowIndex = 0;
    } else if (this.selectedRowIndex >= this.rows.length) {
      this.selectedRowIndex = Math.max(0, this.rows.length - 1);
    }

    this.syncSelectedLayoutToRow();
  }

  private syncSelectedLayoutToRow() {
    const row = this.selectedRow;
    this.selectedLayoutId = -1;
    if (!row) return;

    layouts.forEach((layout) => {
      if (layout.structure.localeCompare(row.structure) === 0) {
        this.selectedLayoutId = layout.id;
      }
    });
  }

  close() {
    this.eventService.emitBoardSideLayoutClickEvent();
  }
}
