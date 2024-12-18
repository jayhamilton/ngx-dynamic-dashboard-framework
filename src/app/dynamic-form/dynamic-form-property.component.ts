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
    standalone: false
})
export class DynamicFormPropertyComponent implements AfterContentInit {
  @Input() property: PropertyBase<any>;
  @Input() form: UntypedFormGroup;
  @Input() gadgetTags: ITag[]; //todo - use to control what endpoints are displayed
  endPoints: string[] = [];

  colors:string[] = ['red', 'blue', 'orange', 'black', 'green'];


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



  /**
   * Remember - This class is present on all gadgets that have property pages. Therefore, any operation here needs to 
   * determine, via the properties, what context or speciic property we are dealing with. The this.property.key is used 
   * to help with the context. 
   */

  setupEventListeners() {

    this.eventService.listenForUserDataChangedEvent().subscribe(event => {

      /**TODO
       * set the role or property key in the event to avoid updating all user related dropdowns. 
       */
      switch(this.property.key){
        case "driver":
        case "qc":
        case "lead":
          this.setDropDownOptions(this.property.key);
          break;
          default:{}
      }
      
    });

    this.eventService.listenForScheduleEventDataChangedEvent().subscribe(event => {

      switch(this.property.key){
        case "lunch":
          this.setDropDownOptions(this.property.key);
          break;
          default:{}
      }

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

  setDropDownOptions(dropDownType: string) {
  
    let _options: { key: string, value: string }[] = [];

    switch (dropDownType) {

      case "driver":
      case "qc":
      case "lead":
        this.userDataStoreService.getUsersByRole(dropDownType).forEach(user => { _options.push({ key: user.username, value: user.username, }) }); 
        break;
      case "lunch":
        this.scheduleDataStoreService.getEvents().forEach(event => { _options.push({ key: event.description + " " + event.datetime, value: event.description + " " + event.datetime }) });
        break;
      case "color1":
      case "color2":
      case "color3":
        {
          this.colors.forEach(color=>{
            _options.push({key: color, value: color});
          })
        }
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
