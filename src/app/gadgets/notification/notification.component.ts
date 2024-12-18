import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';



@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    standalone: false
})
export class NotificationComponent extends GadgetBase  implements OnInit {

  notification1?:string;
  fontSize1 = '30px';
  color1 = "orange";
  notification2?:any;
  fontSize2 = '30px';
  color2 = "orange";
  notification3?:any;
  fontSize3 = '30px';
  color3 = "orange";

  constructor(private sanitizer: DomSanitizer, private eventService: EventService, private boardService: BoardService) {
    super();
    
  }

  ngOnInit(): void {

    this.setNotification();
  }

  setNotification(){
    this.propertyPages[0].properties.forEach((property) => {

      if (property.key == "notification1") {
       
        this.notification1 = property.value;
      }

      if (property.key == "fontsize1") {
       
        this.fontSize1 = property.value + 'px';
      }

      if (property.key == "color1") {
       
        this.color1 = property.value;
      }

      if (property.key == "notification2") {
       
        this.notification2 = property.value;
      }

      if (property.key == "fontsize2") {
       
        this.fontSize2 = property.value + 'px';
      }

      if (property.key == "color2") {
       
        this.color2 = property.value;
      }

      if (property.key == "notification3") {
       
        this.notification3 = property.value;
      }

      if (property.key == "fontsize3") {
       
        this.fontSize3 = property.value + 'px';
      }

      if (property.key == "color3") {
       
        this.color3 = property.value;
      }
    })
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
    if (updatedPropsObject.notification != undefined) {
      this.setNotification();
    }

    //persist changes
    this.boardService.savePropertyPageConfigurationToDestination(
      propertiesJSON,
      this.instanceId
    );
  }

}
