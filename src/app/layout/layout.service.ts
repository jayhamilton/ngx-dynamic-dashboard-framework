import { Injectable } from '@angular/core';
import { IEvent } from '../eventservice/event.service';
import { IGadget } from '../gadgets/common/gadget-common/gadget-base/gadget.model';
import { IBoard } from '../board/board.model';
import { BoardService } from '../board/board.service';
import { LayoutType } from './layout.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  constructor(private boardService: BoardService) {}

  changeLayout(layout: IEvent, board: IBoard) {
    switch (layout.data) {
      case LayoutType.ONE_COL:
        this.updateLayout(layout.data, board, 1);
        break;
      case LayoutType.TWO_COL_EQUAL:
      case LayoutType.TWO_COL_NARROW_WIDE:
      case LayoutType.TWO_COL_WIDE_NARROW:
        this.updateLayout(layout.data, board, 2);
        break;
      case LayoutType.THREE_COL_EQUAL:
        this.updateLayout(layout.data, board, 3);
        break;
      default:
        this.updateLayout(layout.data, board, 2);
    }
  }

  updateLayout(
    layoutData: LayoutType,
    board: IBoard,
    totalColumnCount: number
  ) {
    let list: IGadget[] = this.getGadgetsAsASingleList(board);

    let gadgetLists: IGadget[][] = [];

    let columnStart = 0;
    let currentColumnIndex = columnStart;

    for (let x = 0; x < totalColumnCount; x++) {
      gadgetLists.push([]);
    }

    list.forEach((gadget) => {
      if (currentColumnIndex === totalColumnCount) {
        currentColumnIndex = columnStart;
      }
      gadgetLists[currentColumnIndex].push(gadget);

      currentColumnIndex++;
    });

    console.log(gadgetLists);

    let gadgetColumnArrayList: any[] = [];

    gadgetLists.forEach((list) => {
      gadgetColumnArrayList.push({
        gadgets: list,
      });
    });

    board.rows = [{ columns: gadgetColumnArrayList }];
    board.structure = layoutData;
    this.boardService.updateBoardDueToLayoutChange(board);
  }
  private getGadgetsAsASingleList(board: IBoard) {
    let gadgetList: IGadget[] = [];
    board.rows.forEach((row) => {
      row.columns.forEach((column) => {
        column.gadgets.forEach((gadget) => {
          gadgetList.push(gadget);
        });
      });
    });
    return gadgetList;
  }

}
