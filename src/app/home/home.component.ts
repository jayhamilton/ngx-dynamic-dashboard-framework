import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ScheduleDataStoreService } from '../configuration/tab-schedule/schedule.datastore.service';
import { UserDataStoreService } from '../configuration/tab-user/user.datastore.service';
import { MenuComponent } from '../menu/menu.component';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MenuComponent, SidenavComponent]
})
export class HomeComponent implements OnInit {

  constructor(private  userDataStoreService: UserDataStoreService, private scheduleDataStoreService: ScheduleDataStoreService){

    //load data stores
    this.userDataStoreService.loadUsers("username", "asc");
    this.scheduleDataStoreService.loadScheduledEvents();

  }

  ngOnInit(): void {
  }

}
