/**
 * Created by jayhamilton on 2/3/17.
 */
import { PropertyBase } from './property-base';

export class HiddenProperty extends PropertyBase<string> {
  override controlType = 'hidden';
  
}
