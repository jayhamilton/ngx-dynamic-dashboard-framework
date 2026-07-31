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
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ImageUploadService } from './file-upload/file-upload.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AceEditorComponent } from './ace-editor/ace-editor.component';
import { JsonFormsEditorComponent } from './json-forms-editor/json-forms-editor.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({ declarations: [
        DynamicFormComponent,
        DynamicFormPropertyComponent,
        FileUploadComponent,
        AceEditorComponent,
        JsonFormsEditorComponent,
    ],
    exports: [DynamicFormComponent, DynamicFormPropertyComponent], imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatCardModule], providers: [PropertyControlService, ImageUploadService, MatDatepickerModule, provideHttpClient(withXhr(), withInterceptorsFromDi())] })
export class DynamicFormModule {}
