import { Injectable } from '@angular/core';
import { IEvent } from '../eventservice/event.service';
import { IGadget } from '../gadgets/common/gadget-common/gadget-base/gadget.model';
import { IBoard, IRow } from '../board/board.model';
import { BoardService } from '../board/board.service';
import { LayoutType } from './layout.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  constructor(private boardService: BoardService) {}

  static columnCountFor(structure: string): number {
    switch (structure) {
      case LayoutType.ONE_COL:
        return 1;
      case LayoutType.TWO_COL_EQUAL:
      case LayoutType.TWO_COL_NARROW_WIDE:
      case LayoutType.TWO_COL_WIDE_NARROW:
        return 2;
      case LayoutType.THREE_COL_EQUAL:
        return 3;
      default:
        return 2;
    }
  }

  /**
   * Applies a layout to a single row. rowIndex defaults to 0 so this stays
   * correct for boards that only ever had one row.
   */
  changeLayout(layout: IEvent, board: IBoard) {
    const structure: LayoutType = layout.data?.structure ?? layout.data;
    const rowIndex: number = layout.data?.rowIndex ?? 0;
    this.updateLayout(structure, board, LayoutService.columnCountFor(structure), rowIndex);
  }

  updateLayout(
    layoutData: LayoutType,
    board: IBoard,
    totalColumnCount: number,
    rowIndex: number = 0
  ) {
    this.ensureRows(board);

    if (rowIndex < 0 || rowIndex >= board.rows.length) return;

    const row = board.rows[rowIndex];

    // Only this row's gadgets are redistributed; other rows keep theirs.
    const list: IGadget[] = this.getRowGadgets(row);

    const gadgetLists: IGadget[][] = [];
    for (let x = 0; x < totalColumnCount; x++) {
      gadgetLists.push([]);
    }

    let currentColumnIndex = 0;
    list.forEach((gadget) => {
      if (currentColumnIndex === totalColumnCount) {
        currentColumnIndex = 0;
      }
      gadgetLists[currentColumnIndex].push(gadget);
      currentColumnIndex++;
    });

    row.columns = gadgetLists.map((gadgets) => ({ gadgets }));
    row.structure = layoutData;

    // Keep the board-level structure tracking row 0 so anything still reading
    // it (older saved boards, the panel's initial selection) sees a sane value.
    if (rowIndex === 0) {
      board.structure = layoutData;
    }

    this.boardService.updateBoardDueToLayoutChange(board);
  }

  /** Appends an empty row using the given layout. */
  addRow(board: IBoard, structure: LayoutType = LayoutType.TWO_COL_EQUAL) {
    this.ensureRows(board);

    const columnCount = LayoutService.columnCountFor(structure);
    const columns: { gadgets: IGadget[] }[] = [];
    for (let x = 0; x < columnCount; x++) {
      columns.push({ gadgets: [] });
    }

    board.rows.push({ columns, structure });
    this.boardService.updateBoardDueToLayoutChange(board);
  }

  /**
   * Removes a row, moving any gadgets it held into the first column of the
   * first remaining row so nothing is silently discarded. The last remaining
   * row is never removed — a board always needs somewhere to put gadgets.
   */
  removeRow(board: IBoard, rowIndex: number) {
    this.ensureRows(board);

    if (board.rows.length <= 1) return;
    if (rowIndex < 0 || rowIndex >= board.rows.length) return;

    const [removed] = board.rows.splice(rowIndex, 1);
    const orphaned = this.getRowGadgets(removed);

    if (orphaned.length > 0) {
      const target = board.rows[0];
      if (!target.columns.length) {
        target.columns = [{ gadgets: [] }];
      }
      target.columns[0].gadgets.push(...orphaned);
    }

    board.structure = board.rows[0].structure || board.structure;
    this.boardService.updateBoardDueToLayoutChange(board);
  }

  /**
   * Reorders rows. The rows carry their own gadgets and layout, so moving one
   * is purely positional — nothing needs redistributing.
   */
  moveRow(board: IBoard, previousIndex: number, currentIndex: number) {
    this.ensureRows(board);

    const lastIndex = board.rows.length - 1;
    if (previousIndex === currentIndex) return;
    if (previousIndex < 0 || previousIndex > lastIndex) return;
    if (currentIndex < 0 || currentIndex > lastIndex) return;

    const [moved] = board.rows.splice(previousIndex, 1);
    board.rows.splice(currentIndex, 0, moved);

    // board.structure mirrors the first row, which may now be a different row.
    board.structure = board.rows[0].structure || board.structure;
    this.boardService.updateBoardDueToLayoutChange(board);
  }

  /** A row's layout, falling back to the board's for pre-multi-row boards. */
  structureForRow(board: IBoard, rowIndex: number): string {
    const row = board?.rows?.[rowIndex];
    return row?.structure || board?.structure || LayoutType.TWO_COL_EQUAL;
  }

  private ensureRows(board: IBoard) {
    if (!board.rows || board.rows.length === 0) {
      board.rows = [
        { columns: [{ gadgets: [] }, { gadgets: [] }], structure: board.structure },
      ];
    }
  }

  private getRowGadgets(row: IRow): IGadget[] {
    const gadgets: IGadget[] = [];
    row.columns.forEach((column) => {
      column.gadgets.forEach((gadget) => gadgets.push(gadget));
    });
    return gadgets;
  }
}
