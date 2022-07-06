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
      propertyPage.properties.forEach(
        (property: { key: string; required: boolean; value: string|number }) => {
          group[property.key] = property.required
            ? new UntypedFormControl(property.value || '', Validators.required)
            : new UntypedFormControl(property.value || '');
        }
      );
    });

    return new UntypedFormGroup(group);
  }
}
