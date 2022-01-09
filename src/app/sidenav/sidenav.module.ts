import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav.component';
import {MatSidenavModule} from '@angular/material/sidenav';



@NgModule({
  declarations: [
    SidenavComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule
  ],
  exports: [
    SidenavComponent
  ]
})
export class SidenavModule { }
