import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { UserDataService } from 'src/app/dataservice/user.data.service';
import { RBACUserService, IUser } from './rbac.service';


const ELEMENT_DATA: IUser[] = [];
@Component({
  selector: 'app-rbac',
  templateUrl: './rbac.component.html',
  styleUrls: ['./rbac.component.scss'],
})
export class TabRbacComponent implements OnInit {

  roles = new UntypedFormControl();
  username = new UntypedFormControl();
  formControls :UntypedFormGroup;
  hideRequiredControl = new UntypedFormControl(false); //TODO
  floatLabelControl = new UntypedFormControl('auto'); //TODO


  roleList: string[] = ['Driver', 'Lead', 'Quality Control', 'Administrator'];

  displayedColumns: string[] = ['Id','User Name', 'Roles', 'Tools'];
  dataSource = new UserDataSource(ELEMENT_DATA);
  constructor(private rbacUserService: RBACUserService, private userDataService: UserDataService, formBuilder: UntypedFormBuilder) {
    
    this.formControls = formBuilder.group({

      roles: this.roles,
      username: this.username,
      floatLabelControl: this.floatLabelControl,
      hideRequiredControl: this.hideRequiredControl 


    });

   }

  ngOnInit(): void {

    this.get();

   }
  

  
  get(){
    this.rbacUserService.getUsers().subscribe((userList:IUser[])=>{
      this.dataSource.setData(userList);
      this.userDataService.setUsers(userList);

    })
  }
  
  
  create(){
    this.rbacUserService.createUser(this.username.value,this.roles.value).subscribe((user:any)=>{
      this.get();
    })
  }
  
  
  edit(item: any) {

    this.username.setValue(item.username);
    this.roles.setValue(item.roles);
    //change button icon to updated
  }

  compare(c1:any, c2: any) {
    console.log(c1 + "  " + c2);
    return c1 && c2 && c1 === c2;
  }

  delete(item: any) {

    this.rbacUserService.deleteUser(item.id).subscribe((user:any)=>{
      this.get();
    })

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

