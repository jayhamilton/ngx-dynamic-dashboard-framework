/**
 * Created by jayhamilton on 2/3/17.
 */
import { PropertyBase } from './property-base';

export class UploadProperty extends PropertyBase<string> {
  override controlType = 'upload';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = '';
  }
}
