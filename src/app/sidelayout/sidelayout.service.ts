import { Injectable } from '@angular/core';
import { IEvent } from '../eventservice/event.service';
import { IGadget } from '../gadgets/common/gadget-common/gadget-base/gadget.model';
import { IBoard } from '../board/board.model';
import { BoardService } from '../board/board.service';

export enum LayoutType {

  ONE_COL = "one_col",
  TWO_COL_EVEN = "two_col_equal",
  TWO_COL_40_60 = "two_col_40_60",
  TWO_COL_60_40 = "two_col_60_40",
  THREE_COL_EVEN = "three_col_equal"
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  constructor(private boardService: BoardService) {}

  changeLayout(event: IEvent, board: IBoard) {
    switch (event.data) {
      case LayoutType.ONE_COL:
        this.convertToSingleColumnLayout(board);
        break;
      case LayoutType.TWO_COL_EVEN:
        this.convertToTwoEqualColumnsLayout(board);
        break;
      default:
        this.convertToTwoEqualColumnsLayout(board);
    }
  }
  convertToSingleColumnLayout(board: IBoard) {
    board.rows = [
      {
        columns: [
          {
            gadgets: this.getGadgetsAsASingleList(board),
          },
        ],
      },
    ];

    board.structure = LayoutType.ONE_COL;
    this.boardService.updateBoardDueToLayoutChange(board);
  }

  convertToTwoEqualColumnsLayout(board: IBoard) {
    let list: IGadget[] = this.getGadgetsAsASingleList(board);
    let list1: IGadget[] = [];
    let list2: IGadget[] = [];

    let col = 1;
    list.forEach((gadget) => {

      if (col == 3) {
        col = 1;
      }

      if (col == 1) {
        list1.push(gadget);
      }

      if (col == 2) {
        list2.push(gadget);
      }
      col++;
    });

    board.rows = [{ columns: [{ gadgets: list1 }, { gadgets: list2 }] }];
    board.structure = LayoutType.TWO_COL_EVEN;
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
  convertToThreeEqualColumnsLayout(board: IBoard) {}
  convertToNarrowWideColumnLayout(board: IBoard) {}
  convertToWideNarrowsColumnLayout(board: IBoard) {}
}
