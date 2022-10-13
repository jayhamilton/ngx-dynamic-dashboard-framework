import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';



@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent extends GadgetBase  implements OnInit {

  notification?:any;

  constructor(private sanitizer: DomSanitizer, private eventService: EventService, private boardService: BoardService) {
    super();
    
  }

  ngOnInit(): void {

    this.setNotification();
  }

  setNotification(){
    this.propertyPages[0].properties.forEach((property) => {

      if (property.key == "notification") {
       
        this.notification = this.sanitizer.bypassSecurityTrustHtml(property.value);


     
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
