import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SidelayoutModule } from '../layout/layout.module';
import { SidenavModule } from '../sidenav/sidenav.module';
import { MenuModule } from '../menu/menu.module';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    MenuModule,
    SidenavModule
  ]
})
export class HomeModule { }
