import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationComponent } from './configuration.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TabProductsComponent } from './tab-products/tab-products.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    ConfigurationComponent,
    TabProductsComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTabsModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule
  ],
  exports:[
    ConfigurationComponent
  ]
})
export class ConfigurationModule { }
