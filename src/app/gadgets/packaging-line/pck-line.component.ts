import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { UntypedFormControl } from '@angular/forms';

@Component({
    selector: 'app-pck-line',
    templateUrl: './pck-line.component.html',
    styleUrls: ['./pck-line.component.scss'],
    standalone: false
})
export class PckLineComponent extends GadgetBase implements OnInit {

  driver?: string;
  mcount?: number;
  pcount?: number;
  lunch?: string;
  lineleads?:[];
 

  constructor(private eventService: EventService, private boardService: BoardService) {
    super();
  }

  ngOnInit(): void {
    this.setDriver();
    this.setMCount();
    this.setPCount();
    this.setLunch();
    this.setLineLeads();
  }

  remove() {
    this.eventService.emitGadgetDeleteEvent({ data: this.instanceId });
  }

  setLineLeads() {

    this.propertyPages[0].properties.forEach((property) => {

      if (property.key == "lead") {
        this.lineleads = property.value;
      }

    })
  }

  setLunch() {

    this.propertyPages[0].properties.forEach((property) => {

      if (property.key == "lunch") {
        this.lunch = property.value;
      }
    })
  }

  setDriver() {

    this.propertyPages[0].properties.forEach((property) => {

      if (property.key == "driver") {
        this.driver = property.value;
      }
    })
  }

  setMCount(){
    this.propertyPages[0].properties.forEach((property) => {

      if (property.key == "mcount") {
        this.mcount = property.value;
      }
    })
  }

  setPCount(){
    this.propertyPages[0].properties.forEach((property) => {

      if (property.key == "pcount") {
        this.pcount = property.value;
      }
    })
  }

  propertyChangeEvent(propertiesJSON: string) {
    //update internal props
    const updatedPropsObject = JSON.parse(propertiesJSON);
    console.log(updatedPropsObject);

    if (updatedPropsObject.title != undefined) {
      this.title = updatedPropsObject.title;
    }
    if (updatedPropsObject.subtitle != undefined) {
      this.subtitle = updatedPropsObject.subtitle;
      console.log.apply(this.subtitle);
    }

    if (updatedPropsObject.driver != undefined) {
      this.setDriver();
    }

    if (updatedPropsObject.mcount != undefined) {
      this.setMCount();
    }

    if (updatedPropsObject.pcount != undefined) {
      this.setPCount();
    }

    if (updatedPropsObject.lunch != undefined) {
      this.setLunch();
    }

    if (updatedPropsObject.lead != undefined) {
      this.setLineLeads();
    }



    //persist changes
    this.boardService.savePropertyPageConfigurationToDestination(
      propertiesJSON,
      this.instanceId
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}
