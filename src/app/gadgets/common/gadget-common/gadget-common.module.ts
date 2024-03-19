import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GadgetHeaderComponent } from './gadget-header/gadget-header.component';
import { GadgetOperationComponent } from './gadget-operation/gadget-operation.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';



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
