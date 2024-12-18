import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/board/board.service';
import { ScheduleDataStoreService } from 'src/app/configuration/tab-schedule/schedule.datastore.service';
import { IScheduledEvent } from 'src/app/configuration/tab-schedule/schedule.service';
import { UserDataStoreService } from 'src/app/configuration/tab-user/user.datastore.service';
import { IUser } from 'src/app/configuration/tab-user/user.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';



@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss'],
    standalone: false
})
export class EventsComponent extends GadgetBase  implements OnInit {

  productiondate:string = "";

  constructor(private scheduleDataServices: ScheduleDataStoreService, private eventService: EventService, private boardService: BoardService) {
    super();
    //this.setDate();
  }

  ngOnInit(): void {

   
  }

  getEvents():IScheduledEvent[]{
    
    return this.scheduleDataServices.getEvents();
  }

  remove() {
    this.eventService.emitGadgetDeleteEvent({ data: this.instanceId });
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

    //persist changes
    this.boardService.savePropertyPageConfigurationToDestination(
      propertiesJSON,
      this.instanceId
    );
  }

}
