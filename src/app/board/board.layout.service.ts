import { Injectable } from '@angular/core';
import { throwMatDuplicatedDrawerError } from '@angular/material/sidenav';
import { IEvent } from '../eventservice/event.service';
import { IGadget } from '../gadgets/common/gadget-common/gadget-base/gadget.model';
import { IBoard } from './board.model';
import { BoardService } from './board.service';

@Injectable({
  providedIn: 'root',
})
export class BoardLayoutService {
  constructor(private boardService: BoardService) {}

  changeLayout(event: IEvent, board: IBoard) {
    switch (event.data) {
      case 'one_col':
        this.convertToSingleColumnLayout(board);
        break;
      case 'two_col_equal':
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

    board.structure = 'one_col';
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
    board.structure = 'two_col_equal';
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
