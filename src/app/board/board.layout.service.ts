import { CdkColumnDef } from '@angular/cdk/table';
import { Injectable } from '@angular/core';
import { BADRESP } from 'dns';
import { IGadget } from '../gadgets/common/gadget-common/gadget-base/gadget.model';
import { IBoard, IColumn } from './board.model';

@Injectable({
  providedIn: 'root',
})
export class BoardLayoutService {
  convertToSingleColumnLayout(board: IBoard) {
    let gadgetList: IGadget[] = [];
    board.rows.forEach((row)=>{
      row.columns.forEach((column)=>{
          gadgetList = [...column.gadgets];
      });
    });
    board.rows = [];
    board.rows = [...[{columns:[{gadgets: gadgetList}]}]];
  }

  convertToTwoEqualColumnsLayout(board: IBoard){
  }
  convertToThreeEqualColumnsLayout(board: IBoard){
  }
  convertToNarrowWideColumnLayout(board: IBoard){
  }
  convertToWideNarrowColumnLayout(board: IBoard){
  }
}
