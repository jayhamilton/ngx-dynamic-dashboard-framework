/**
 * Created by jayhamilton on 2/3/17.
 */
import { PropertyBase } from './property-base';

export class NumberProperty extends PropertyBase<number> {
  override controlType = 'number';
  type: number;

  constructor(options: {} = {}) {
    super(options);
    this.type = -1;
  }
}
