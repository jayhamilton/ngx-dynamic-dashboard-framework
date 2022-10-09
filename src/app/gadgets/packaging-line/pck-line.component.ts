import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { UserDataService } from 'src/app/dataservice/user.data.service';
import { UntypedFormControl } from '@angular/forms';
import { IUser } from 'src/app/configuration/tab-rbac/rbac.service';
interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-pck-line',
  templateUrl: './pck-line.component.html',
  styleUrls: ['./pck-line.component.scss']
})
export class PckLineComponent extends GadgetBase implements OnInit {
  leads = new UntypedFormControl();
  leadList: Array<string> = [];

  constructor(private userDataService: UserDataService, private eventService: EventService, private boardService: BoardService) {
    super();

    this.setupEventHandlers();

  }


  ngOnInit(): void {
    this.getLeadsList();
  }

  setupEventHandlers(){

    this.eventService.listenForUserDataChangedEvent().subscribe(() => {
      this.getLeadsList();
    });
  }

  remove() {
    this.eventService.emitGadgetDeleteEvent({ data: this.instanceId });
  }

  getLeadsList() {
    this.leadList.length = 0;

    this.userDataService.getUsers().forEach(record => {

        if (record.roles.toLocaleLowerCase().localeCompare('lead') === 0) {

          this.leadList.push(record.username);

        }

      });
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
