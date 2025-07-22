import { PropertyBase } from './property-base';

export class JsonFormsProperty extends PropertyBase<string> {
  override controlType = 'json-forms';
  
  constructor(options: {} = {}) {
    super(options);
  }
}