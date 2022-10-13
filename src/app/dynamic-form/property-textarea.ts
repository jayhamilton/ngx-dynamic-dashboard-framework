/**
 * Created by jayhamilton on 2/3/17.
 */
import { PropertyBase } from './property-base';

export class TextareaProperty extends PropertyBase<string> {
  override controlType = 'textarea';
  
}
