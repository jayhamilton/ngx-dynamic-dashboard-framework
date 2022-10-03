import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';

export interface IUser {
  username: string;
  roles: string;
}
const ELEMENT_DATA: IUser[] = [];
@Component({
  selector: 'app-rbac',
  templateUrl: './rbac.component.html',
  styleUrls: ['./rbac.component.scss'],
})
export class TabRbacComponent implements OnInit {

  displayedColumns: string[] = ['User Name', 'Roles', 'Tools'];
  dataSource = new UserDataSource(ELEMENT_DATA);
  constructor() { }

  ngOnInit(): void { }
  roles = new FormControl('');
  roleList: string[] = ['Driver', 'Lead', 'Quality Control', 'Administrator'];

  edit(item: any) {

  }

  delete(item: any) {

  }
}


class UserDataSource extends DataSource<IUser> {
  private _dataStream = new ReplaySubject<IUser[]>();

  constructor(initialData: IUser[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<IUser[]> {
    return this._dataStream;
  }

  disconnect() { }

  setData(data: IUser[]) {
    this._dataStream.next(data);
  }
}

