import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { BoardService } from './board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent {
  boardData: any;
  constructor(private boardService: BoardService) {
    this.boardData = this.boardService.getDefaultData();
  }

  drop(event: CdkDragDrop<string[]>) {
    //console.log(event);
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
    this.updateDataModel(event.container, event.previousContainer);
  }

  getImage(colIdx: number, gadgetIdx: number) {
    return '/assets/images/img' + gadgetIdx;
  }

  getColumnIndexAsString(idx: number) {
    return '' + idx;
  }

  updateDataModel(container: CdkDropList, previousContainer: CdkDropList) {
    let cIdx = parseInt(container.id);
    let pIdx = parseInt(previousContainer.id);

    //this means a component was moved from one column to another
    if (cIdx != pIdx) {
      this.boardData[pIdx].gadgetNames = previousContainer.data;
    }

    this.boardData[cIdx].gadgetNames = container.data;

    //persist the change
    this.boardService.write(this.boardData);
  }
}
