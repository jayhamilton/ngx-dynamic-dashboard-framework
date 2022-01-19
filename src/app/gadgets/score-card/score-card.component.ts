import { Component } from '@angular/core';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { EventService } from '../../eventservice/event.service'

export interface PeriodicElement {
  hours: number;
  goal: number;
  actual: number;
  comments: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {hours: 4, goal: 0, actual: 4, comments: ''},

];

@Component({
  selector: 'app-score-card',
  templateUrl: './score-card.component.html',
  styleUrls: ['./score-card.component.css']
})
export class ScoreCardComponent extends GadgetBase{

  gadgetData: any;
  displayedColumns: string[] = ['hours', 'goal', 'actual', 'comments'];
  dataSource = ELEMENT_DATA;

  constructor(private  eventService: EventService) {
    super();

  }


  remove(){
    this.eventService.emitGadgetDeleteEvent({data: this.instanceId});
  }

}



