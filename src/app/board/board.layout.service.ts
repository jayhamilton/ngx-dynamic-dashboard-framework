import { Injectable } from '@angular/core';
import { IGadget } from '../gadgets/common/gadget-common/gadget-base/gadget.model';
import { IBoard } from './board.model';
import { BoardService } from './board.service';

@Injectable({
  providedIn: 'root',
})
export class BoardLayoutService {
  constructor(private boardService: BoardService) {}

  convertToSingleColumnLayout(board: IBoard) {
    let gadgetList: IGadget[] = [];
    board.rows.forEach((row) => {
      row.columns.forEach((column) => {
        column.gadgets.forEach((gadget) => {
          gadgetList.push(gadget);
        });
      });
    });
    board.rows = [];
    board.rows = [...[{ columns: [{ gadgets: gadgetList }] }]];
    board.structure = 'B';
    this.boardService.updateBoardDueToLayoutChange(board);
    console.log(board);
  }

  convertToTwoEqualColumnsLayout(board: IBoard) {}
  convertToThreeEqualColumnsLayout(board: IBoard) {}
  convertToNarrowWideColumnLayout(board: IBoard) {}
  convertToWideNarrowColumnLayout(board: IBoard) {}
}
