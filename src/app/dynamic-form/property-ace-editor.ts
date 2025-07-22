import { PropertyBase } from './property-base';

export class AceEditorProperty extends PropertyBase<string> {
  override controlType = 'ace-editor';
  
  constructor(options: {} = {}) {
    super(options);
  }
}