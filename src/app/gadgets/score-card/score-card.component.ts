import { Component } from '@angular/core';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { EventService } from '../../eventservice/event.service'

export interface PeriodicElement {
  hours: string;
  goal: number;
  actual: number;
  comments: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {hours: '7:30', goal: 0, actual: 0, comments: ''},
  {hours: '8:30', goal: 0, actual: 0, comments: ''},
  {hours: '8:30', goal: 0, actual: 0, comments: ''},
  {hours: '9:30', goal: 0, actual: 0, comments: ''},
  {hours: '9:30', goal: 0, actual: 0, comments: ''},
  {hours: '10:30', goal: 0, actual: 0, comments: ''},
  {hours: '10:30', goal: 0, actual: 0, comments: ''},
  {hours: '11:30', goal: 0, actual: 0, comments: ''},
  {hours: '11:30', goal: 0, actual: 0, comments: ''},
  {hours: '12:30', goal: 0, actual: 0, comments: ''},
  {hours: '12:30', goal: 0, actual: 0, comments: ''},
  {hours: '1:30', goal: 0, actual: 0, comments: ''},
  {hours: '2:30', goal: 0, actual: 0, comments: ''},
  {hours: '3:30', goal: 0, actual: 0, comments: ''},
  {hours: '3:30', goal: 0, actual: 0, comments: ''},
  {hours: '4:30', goal: 0, actual: 0, comments: ''},
  {hours: '5:30', goal: 0, actual: 0, comments: ''},
  {hours: '6:30', goal: 0, actual: 0, comments: ''},


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



