import { Component, OnInit } from '@angular/core';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { EventService } from '../../eventservice/event.service'
import { BoardService } from 'src/app/board/board.service';

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
    styleUrls: ['./score-card.component.scss'],
    standalone: false
})
export class ScoreCardComponent extends GadgetBase implements OnInit{

  gadgetData: any;
  displayedColumns: string[] = ['hours', 'goal', 'actual', 'comments'];
  dataSource = ELEMENT_DATA;
  date: string;
  teamLead: string;
  jobNumber: number;

  constructor(private  eventService: EventService, private boardService: BoardService ){
    super();
    this.date ="";
    this.teamLead = "";
    this.jobNumber=-1;
  }
  ngOnInit(): void {
    this.teamLead = this.propertyPages[0].properties[2].value;
    this.jobNumber = this.propertyPages[0].properties[3].value;
    this.date = this.propertyPages[0].properties[4].value;

  }
  remove(){
    this.eventService.emitGadgetDeleteEvent({data: this.instanceId});
  }
  propertyChangeEvent(propertiesJSON: string) {
    //update internal props
    const updatedPropsObject = JSON.parse(propertiesJSON);

    if (updatedPropsObject.title != undefined) {
      this.title = updatedPropsObject.title;
    }
    if (updatedPropsObject.subtitle != undefined) {
      this.subtitle = updatedPropsObject.subtitle;
    }

    //persist changes
    this.boardService.savePropertyPageConfigurationToDestination(
      propertiesJSON,
      this.instanceId
    );
  }

}



