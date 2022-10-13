/**
 * Created by jayhamilton on 2/5/17.
 */
import { AfterContentInit, AfterViewInit, Component, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { PropertyBase } from './property-base';

import { style, trigger, animate, transition } from '@angular/animations';
import { ITag } from '../gadgets/common/gadget-common/gadget-base/gadget.model';
import { UserDataStoreService } from '../configuration/tab-user/user.datastore.service';
import { ScheduleDataStoreService } from '../configuration/tab-schedule/schedule.datastore.service';
import { EventService } from '../eventservice/event.service';

@Component({
  selector: 'app-df-property',
  templateUrl: './dynamic-form-property.component.html',
  styleUrls: ['./styles-props.scss'],
  animations: [
    trigger('showHideAnimation', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(750, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        // :leave is alias to '* => void'
        animate(750, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class DynamicFormPropertyComponent implements AfterContentInit {
  @Input() property: PropertyBase<any>;
  @Input() form: UntypedFormGroup;
  @Input() gadgetTags: ITag[]; //todo - use to control what endpoints are displayed
  endPoints: string[] = [];

  USERCHANGEEVENT: string = "driver";
  SCHEDULECHANGEEVENT = "lunch";

  get isValid() {
    return this.form.controls[this.property.key].valid;
  }

  constructor(formBuilder: UntypedFormBuilder,
    private userDataStoreService: UserDataStoreService,
    private scheduleDataStoreService: ScheduleDataStoreService,
    private eventService: EventService

  ) {
    this.property = {
      key: '',
      label: '',
      required: false,
      order: -1,
      controlType: '',
      options: []
    };
    this.gadgetTags = [];
    this.form = formBuilder.group({});

    this.setupEventListeners();
  }


  setupEventListeners() {

    this.eventService.listenForUserDataChangedEvent().subscribe(event => {

      this.setDropDownOptions(this.USERCHANGEEVENT);

    });

    this.eventService.listenForScheduleEventDataChangedEvent().subscribe(event => {

      this.setDropDownOptions(this.SCHEDULECHANGEEVENT);

    });
  }

  ngAfterContentInit() {

    switch (this.property.controlType) {

      case 'dropdown-ms':
      case 'dropdown':
        this.setDropDownOptions(this.property.key);
        break;
      default:
        { }
    }
  }

  setDropDownOptions(configurationTabDataChangeListType: string) {

    //only update the options that are impacted by the change in the board configuration. If the update is a result of the User tab vs the Schedule tab.
    if(this.property.key !== configurationTabDataChangeListType){
      return;
    }

    /**
     * TODO: Make this more generic. For the moment, we have gadgets
     * that have user/role based dropdowns and therefore will rely
     * on the user service to populate the options. Options could be needed
     * for a number of different dropdown types. 
     */


    let _options: { key: string, value: string }[] = [];


    switch (configurationTabDataChangeListType) {

      case "driver":
      case "qc":
      case "lead":
        this.userDataStoreService.getUsersByRole(configurationTabDataChangeListType).forEach(user => { _options.push({ key: user.username, value: user.username, }) });
        break;
      case "lunch":
        this.scheduleDataStoreService.getEvents().forEach(event => { _options.push({ key: event.description + " " + event.datetime, value: event.description + " " + event.datetime }) });
        break;
      default:
        { }
    }


    this.property.options = _options;

  }

  updateFileList(fileList: FileList) {
    console.log('Updating the file list!!!!');
    console.log(fileList);

    let fileNames = '';
    for (let x = 0; x < fileList.length; x++) {
      fileNames += fileList[x].name;
      if (x < fileList.length - 1) {
        fileNames += ', ';
      }
    }
    this.form.controls['file-list'].setValue(fileNames);
    this.form.controls['file-list'].markAsDirty();
    console.log('updating file list');
  }
}
