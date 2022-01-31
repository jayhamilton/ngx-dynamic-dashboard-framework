/**
 * Created by jayhamilton on 2/3/17.
 */
import { PropertyBase } from './property-base';

export class TextboxProperty extends PropertyBase<string> {
  override controlType = 'date';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = '';
  }
}
