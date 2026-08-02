import { Component, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { ICON_OPTIONS } from './icon-options';

@Component({
    selector: 'app-icon-picker',
    templateUrl: './icon-picker.component.html',
    styleUrls: ['./icon-picker.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IconPickerComponent),
            multi: true,
        },
    ],
    imports: [MatIcon, MatIconButton, MatButton, MatMenu, MatMenuTrigger, MatFormField, MatLabel, MatPrefix, MatInput, MatTooltip, FormsModule]
})
export class IconPickerComponent implements ControlValueAccessor {
  readonly allIcons = ICON_OPTIONS;
  filterText = '';
  value: string = 'dashboard';
  disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get filteredIcons(): string[] {
    const term = this.filterText.trim().toLowerCase();
    if (!term) return this.allIcons;
    return this.allIcons.filter((icon) => icon.includes(term));
  }

  select(icon: string) {
    this.value = icon;
    this.onChange(icon);
    this.onTouched();
  }

  menuClosed() {
    this.filterText = '';
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value || 'dashboard';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
