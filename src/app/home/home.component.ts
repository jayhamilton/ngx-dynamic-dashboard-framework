import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../dataservice/user.data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private  _userDataService: UserDataService){

    //load data stores
    this._userDataService.loadUsers();

  }

  ngOnInit(): void {
  }

}
