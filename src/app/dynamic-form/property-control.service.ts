/**
 * Created by jayhamilton on 2/3/17.
 */
import { Injectable } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Injectable()
export class PropertyControlService {
  constructor() {}

  toFormGroupFromPP(propertyPages: any[]) {
    const group: any = {};

    propertyPages.forEach((propertyPage) => {
      propertyPage.properties.forEach((property: any) => {
        if (property.controlType === 'section') return;
        const val = (property.value !== undefined && property.value !== null) ? property.value : '';
        group[property.key] = property.required
          ? new UntypedFormControl(val, Validators.required)
          : new UntypedFormControl(val);
      });
    });

    return new UntypedFormGroup(group);
  }
}
