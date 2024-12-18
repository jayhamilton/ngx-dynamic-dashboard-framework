import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { ImageService } from './image.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { EventService } from 'src/app/eventservice/event.service';
import { BoardService } from 'src/app/board/board.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss'],
    standalone: false
})
export class ImageComponent extends GadgetBase implements OnInit {
  imageLists: any[];
  apihost = environment.apihost;
  api = environment.imageAPI;

  constructor(
    private imageService: ImageService,
    private eventService: EventService,
    private boardService: BoardService
  ) {
    super();

    this.imageLists = [];
  }

  ngOnInit(): void {
    let fileList = this.propertyPages[1].properties[0].value;

    if (fileList.localeCompare('') != 0) {
      this.imageLists = this.imageService.getImageLists(fileList);
    }
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

  getIndexAsString(idx: number) {
    return '' + idx;
  }

  updateDataModel(container: CdkDropList, previousContainer: CdkDropList) {
    let cIdx = parseInt(container.id);
    let pIdx = parseInt(previousContainer.id);

    //this means a component was moved from one column to another
    if (cIdx != pIdx) {
      this.imageLists[pIdx].imageNames = previousContainer.data;
    }

    this.imageLists[cIdx].imageNames = container.data;

    //todo update board by getting a flat list and then saving
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
    if (updatedPropsObject.subtitle != undefined) {
      this.subtitle = updatedPropsObject.subtitle;
      console.log.apply(this.subtitle);
    }

    if (updatedPropsObject['file-list'] != undefined) {
      this.imageLists = this.imageService.getImageLists(
        updatedPropsObject['file-list']
      );
      this.propertyPages[1].properties[0].value =
        updatedPropsObject['file-list'];
    }

    //persist changes
    this.boardService.savePropertyPageConfigurationToDestination(
      propertiesJSON,
      this.instanceId
    );
  }
}
