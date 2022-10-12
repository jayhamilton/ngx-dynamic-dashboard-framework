import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SidenavModule } from '../sidenav/sidenav.module';
import { MenuModule } from '../menu/menu.module';
import { UserDataStoreService } from '../configuration/tab-user/user.datastore.service';
import { ScheduleDataStoreService } from '../configuration/tab-schedule/schedule.datastore.service';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, MenuModule, SidenavModule],
  exports: [],
  providers:[UserDataStoreService, ScheduleDataStoreService]
})
export class HomeModule {}
