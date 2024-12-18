import { Component, OnInit } from '@angular/core';
import { ScheduleDataStoreService } from '../configuration/tab-schedule/schedule.datastore.service';
import { UserDataStoreService } from '../configuration/tab-user/user.datastore.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
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
