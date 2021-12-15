import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule}from '@angular/material/icon';
import {MenuEventService} from './menu-service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ConfigurationModule } from '../configuration/configuration.module';
@NgModule({
  declarations: [
    MenuComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    ConfigurationModule
  ],
  exports:[
    MenuComponent
  ],
  providers: [
    MenuEventService
  ]
})
export class MenuModule { }
