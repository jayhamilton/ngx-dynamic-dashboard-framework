import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormPropertyComponent } from './dynamic-form-property.component';
import { PropertyControlService } from './property-control.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ImageUploadService } from './file-upload/file-upload.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: [
    DynamicFormComponent,
    DynamicFormPropertyComponent,
    FileUploadComponent,
  ],
  providers: [PropertyControlService, ImageUploadService, MatDatepickerModule],
  exports: [DynamicFormComponent, DynamicFormPropertyComponent],
})
export class DynamicFormModule {}
