import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';



@Component({
    selector: 'app-date',
    templateUrl: './date.component.html',
    styleUrls: ['./date.component.scss'],
    standalone: false
})
export class DateComponent extends GadgetBase  implements OnInit {

  productiondate:string = "";

  constructor(private eventService: EventService, private boardService: BoardService) {
    super();
    //this.setDate();
  }

  ngOnInit(): void {

    this.setDate();
  }

  setDate(){
    this.propertyPages[0].properties.forEach((property) => {

      if (property.key == "productiondate") {
       
        console.log("printing production date: " + this.productiondate);
        let date = new Date(property.value);

        this.productiondate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

     
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
    if (updatedPropsObject.productiondate != undefined) {
      this.setDate();
    }

    //persist changes
    this.boardService.savePropertyPageConfigurationToDestination(
      propertiesJSON,
      this.instanceId
    );
  }

}
