import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
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

  displayedColumns: string[] = ['User Name', 'Roles', 'Tools'];
  dataSource = new UserDataSource(ELEMENT_DATA);
  constructor(private rbacUserService: RBACUserService, formBuilder: UntypedFormBuilder) {
    
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
    })

  }
  
  
  create(){

    this.rbacUserService.createUser(this.username.value,this.roles.value).subscribe((user:any)=>{

      this.get();
    
    })
    
  }
  
  
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

