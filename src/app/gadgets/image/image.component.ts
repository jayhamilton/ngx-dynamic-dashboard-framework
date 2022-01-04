import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { ImageService } from './image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent  {


  gadgetData: any;

  constructor(private imageService: ImageService) {
    this.gadgetData = this.imageService.getDefaultData();
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
      this.gadgetData[pIdx].gadgetNames = previousContainer.data;
    }

    this.gadgetData[cIdx].gadgetNames = container.data;

    //persist the change
    this.imageService.write(this.gadgetData);
  }

}
