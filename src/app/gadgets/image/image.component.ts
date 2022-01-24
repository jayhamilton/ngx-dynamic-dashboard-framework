import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { ImageService } from './image.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { EventService } from 'src/app/eventservice/event.service';
import { IProperty } from '../common/gadget-common/gadget-base/gadget.model';
import { BoardService } from 'src/app/board/board.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css'],
})
export class ImageComponent extends GadgetBase {
  gadgetData: any;

  constructor(
    private imageService: ImageService,
    private eventService: EventService,
    private boardService: BoardService
  ) {
    super();
    this.gadgetData = this.imageService.getDefaultData();
  }

  drop(event: CdkDragDrop<string[]>) {
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

  remove() {
    this.eventService.emitGadgetDeleteEvent({ data: this.instanceId });
  }

  propertyChangeEvent(propertiesJSON: string) {
    //update internal props
    const updatedPropsObject = JSON.parse(propertiesJSON);

    if (updatedPropsObject.title != undefined) {
      this.title = updatedPropsObject.title;
    }

    //persist changes
    this.boardService.savePropertyPageConfigurationToDestination(
      propertiesJSON,
      this.instanceId
    );
  }
}
