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
        this.convertToOneColumnLayout(layout.data, board);
        break;
      case LayoutType.TWO_COL_EVEN:
      case LayoutType.TWO_COL_NARROW_WIDE:
      case LayoutType.TWO_COL_WIDE_NARROW:
        this.convertToTwoColumnsLayout(layout.data, board);
        break;
      default:
        this.convertToTwoColumnsLayout(layout.data, board);
    }
  }
  convertToOneColumnLayout(layoutData: LayoutType, board: IBoard) {
    board.rows = [
      {
        columns: [
          {
            gadgets: this.getGadgetsAsASingleList(board),
          },
        ],
      },
    ];

    board.structure = layoutData;
    this.boardService.updateBoardDueToLayoutChange(board);
  }

  convertToTwoColumnsLayout(layoutData: LayoutType, board: IBoard) {
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
  convertToThreeEqualColumnsLayout(board: IBoard) {}
  convertToNarrowWideColumnLayout(board: IBoard) {}
  convertToWideNarrowsColumnLayout(board: IBoard) {}
}
