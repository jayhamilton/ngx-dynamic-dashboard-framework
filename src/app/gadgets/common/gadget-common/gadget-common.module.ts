import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GadgetHeaderComponent } from './gadget-header/gadget-header.component';
import { GadgetOperationComponent } from './gadget-operation/gadget-operation.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';



@NgModule({
  declarations: [
    GadgetHeaderComponent,
    GadgetOperationComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatChipsModule
  ],
  exports: [
    GadgetHeaderComponent,
    GadgetOperationComponent
  ]})
export class GadgetCommonModule { }
