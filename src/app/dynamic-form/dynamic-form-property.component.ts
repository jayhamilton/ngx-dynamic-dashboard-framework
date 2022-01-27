/**
 * Created by jayhamilton on 2/5/17.
 */
import { AfterViewInit, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PropertyBase } from './property-base';

import { style, trigger, animate, transition } from '@angular/animations';
import {ITag } from '../gadgets/common/gadget-common/gadget-base/gadget.model';

@Component({
  selector: 'app-df-property',
  templateUrl: './dynamic-form-property.component.html',
  styleUrls: ['./styles-props.css'],
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
export class DynamicFormPropertyComponent implements AfterViewInit {
  @Input() property: PropertyBase<any>;
  @Input() form: FormGroup;
  @Input() gadgetTags: ITag[]; //todo - use to control what endpoints are displayed
  endPoints: string[] = [];


  get isValid() {

    return this.form.controls[this.property.key].valid;
  }

  constructor(formBuilder: FormBuilder) {
    this.property = {
      key: '',
      label: '',
      required: false,
      order: -1,
      controlType: ''
    };
    this.gadgetTags = [];
    this.form = formBuilder.group({});

    this.updateEndPointList();
  }

  updateEndPointList() {}

  ngAfterViewInit() {
    //filter endpoints based on the gadgets tags
  }


}
