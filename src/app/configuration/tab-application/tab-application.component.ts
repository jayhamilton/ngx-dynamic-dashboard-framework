import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { AppConfigService } from 'src/app/app-config/app-config.service';

@Component({
    selector: 'app-tab-application',
    templateUrl: './tab-application.component.html',
    styleUrls: ['./tab-application.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, ReactiveFormsModule, MatFormField, MatInput, MatButton, MatIcon, MatSlideToggle]
})
export class TabApplicationComponent {
  appTitle = new UntypedFormControl('');
  saved = false;

  constructor(private appConfigService: AppConfigService, private cdr: ChangeDetectorRef) {
    this.appTitle.setValue(this.appConfigService.appTitle);
  }

  get cardBackgroundTransparent(): boolean {
    return this.appConfigService.cardBackgroundTransparent;
  }

  toggleCardBackgroundTransparent(checked: boolean) {
    this.appConfigService.setCardBackgroundTransparent(checked);
  }

  save() {
    this.appConfigService.setAppTitle(this.appTitle.value);
    // Reflect any normalization the service applied (trimming, or falling
    // back to the built-in default when cleared).
    this.appTitle.setValue(this.appConfigService.appTitle);
    this.appTitle.markAsPristine();
    this.flashSaved();
  }

  resetToDefault() {
    this.appConfigService.resetAppTitle();
    this.appTitle.setValue(this.appConfigService.appTitle);
    this.appTitle.markAsPristine();
    this.flashSaved();
  }

  private flashSaved() {
    this.saved = true;
    // setTimeout isn't an Angular-recognized trigger under zoneless change
    // detection, so the mutation below needs an explicit check — no global
    // tick gets scheduled for a bare timer callback.
    setTimeout(() => {
      this.saved = false;
      this.cdr.detectChanges();
    }, 2000);
  }
}
