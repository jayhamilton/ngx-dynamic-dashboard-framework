/**
 * Created by jayhamilton on 2/5/17.
 */
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';

import {
  style,
  state,
  trigger,
  animate,
  transition,
} from '@angular/animations';

import { FormControl, FormGroup } from '@angular/forms';

import { PropertyControlService } from './property-control.service';
import {IPropertyPage, ITag } from '../gadgets/common/gadget-common/gadget-base/gadget.model';

@Component({
  /* solves error: Expression has changed after it was checked exception resolution - https://www.youtube.com/watch?v=K_BRcal-JfI*/
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./styles-props.css'],
  animations: [
    trigger('contentSwitch', [
      state(
        'inactive',
        style({
          opacity: 0,
        })
      ),
      state(
        'active',
        style({
          opacity: 1,
        })
      ),
      transition('inactive => active', animate('750ms ease-in')),
      transition('active => inactive', animate('750ms ease-out')),
    ]),
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
  providers: [PropertyControlService],
})
export class DynamicFormComponent implements OnInit, AfterViewInit {
  @Input() gadgetTags: ITag[]; //todo - use to control what endpoints are displayed
  @Input() propertyPages: IPropertyPage[];
  @Input() instanceId: number;
  @Output() updatePropertiesEvent: EventEmitter<any> = new EventEmitter(true);
  currentTab = 'run';
  state = 'inactive';
  lastActiveTab = {};
  selected = new FormControl(0);

  form: FormGroup = new FormGroup({});
  payLoad = '';
  showMessage = false;

  constructor(
    private pcs: PropertyControlService,

    private changeDetectionRef: ChangeDetectorRef
  ) {
    this.gadgetTags = []; //todo - use to control what endpoints are displayed
    this.propertyPages = [];
    this.instanceId = -20;
  }

  /* better solution that solves error: Expression has changed after it was checked exception resolution*/
  ngAfterViewInit(): void {
    this.changeDetectionRef.detectChanges();
  }

  ngOnInit() {
    this.form = this.pcs.toFormGroupFromPP(this.propertyPages);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);

    this.updatePropertiesEvent.emit(this.payLoad);
    console.log("form payload");
    console.log(this.payLoad);

    console.debug('Sending configuration to the config service!');
  }

  setCurrentTab(tab: any) {
    this.currentTab = tab.groupId;
  }

  get isPropertyPageValid() {

    return this.form.valid;
  }
  setSelected(event: any) {

  }
}
