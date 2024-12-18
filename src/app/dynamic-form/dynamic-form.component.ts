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

import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { PropertyControlService } from './property-control.service';
import {
  IPropertyPage,
  ITag,
} from '../gadgets/common/gadget-common/gadget-base/gadget.model';

@Component({
    /* solves error: Expression has changed after it was checked exception resolution - https://www.youtube.com/watch?v=K_BRcal-JfI*/
    // changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./styles-props.scss'],
    animations: [
        trigger('contentSwitch', [
            state('inactive', style({
                opacity: 0,
            })),
            state('active', style({
                opacity: 1,
            })),
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
    standalone: false
})
export class DynamicFormComponent implements OnInit, AfterViewInit {
  @Input() gadgetTags: ITag[]; //todo - use to control what endpoints are displayed
  @Input() propertyPages: IPropertyPage[];
  @Input() instanceId: number;
  @Output() updatePropertiesEvent: EventEmitter<any> = new EventEmitter(true);

  currentTab = 'run';
  state = 'inactive';
  lastActiveTab = {};
  selected = new UntypedFormControl(0);
  @Input() tabIndex: number;

  form: UntypedFormGroup = new UntypedFormGroup({});
  payLoad = '';
  showMessage: boolean = false;

  constructor(
    private pcs: PropertyControlService,

    private changeDetectionRef: ChangeDetectorRef
  ) {
    this.gadgetTags = []; //todo - use to control what endpoints are displayed
    this.propertyPages = [];
    this.instanceId = -20;
    this.tabIndex = this.selected.value;
    console.log('this selected');
    console.log(this.selected);
  }

  /* better solution that solves error: Expression has changed after it was checked exception resolution*/
  ngAfterViewInit(): void {
    this.changeDetectionRef.detectChanges();
  }

  ngOnInit() {
    this.form = this.pcs.toFormGroupFromPP(this.propertyPages);
  }

  saveForm() {
    this.payLoad = JSON.stringify(this.form.value);
    this.updatePropertiesEvent.emit(this.payLoad);

    if (this.payLoad) {
      this.showMessage = true;
      let me = this;

      setTimeout(
        function () {
          me.showMessage = false;
        }.bind(this),
        2000
      );
    }

    //console.log(this.payLoad);
  }

  get isPropertyPageValid() {
    return this.form.valid;
  }
  setSelected(event: any) {
    console.log(event);
  }
}
