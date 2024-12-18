import { DataSource } from '@angular/cdk/collections';
import { TaggedTemplateExpr } from '@angular/compiler';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Observable, ReplaySubject } from 'rxjs';
import { UserDataStoreService } from './user.datastore.service';
import { UserService, IUser } from './user.service';


const ELEMENT_DATA: IUser[] = [];
@Component({
    selector: 'app-rbac',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    standalone: false
})
export class TabUserComponent implements OnInit, AfterViewInit {

  editMode = false;
  @ViewChild(MatSort) sort!: MatSort;

  sortKey:string = "username";
  sortOrder:string = "asc";

  selectedId: number;
  roles = new UntypedFormControl();
  username = new UntypedFormControl();
  form: UntypedFormGroup;
  hideRequiredControl = new UntypedFormControl(false); //TODO
  floatLabelControl = new UntypedFormControl('auto'); //TODO


  roleList: string[] = ['Driver', 'Lead'];

  displayedColumns: string[] = ['Name', 'Role', 'Tools'];
  dataSource = new UserDataSource(ELEMENT_DATA);
  constructor(private userService: UserService, private userDataStoreService: UserDataStoreService, formBuilder: UntypedFormBuilder, private dialog: MatDialog) {


    this.selectedId = -1;
    this.form = formBuilder.group({

      roles: this.roles,
      username: this.username,
      floatLabelControl: this.floatLabelControl,
      hideRequiredControl: this.hideRequiredControl

    });

  }
  ngAfterViewInit(): void {
    //this.sort.sortChange.subscribe(() => ());

  }

  ngOnInit(): void {

    this.get(false);

  }

  sortData(data: any){

    //console.log(data);
    if(data['active'] === "Name"){
      this.sortKey = "username";
    }

    if(data['active'] === "Role"){
      this.sortKey = "roles"
    }
    this.sortOrder = data['direction'];

    this.get(true);

  }

  get(updateCache: boolean) {
    this.userService.getUsers(this.sortKey, this.sortOrder).subscribe((userList: IUser[]) => {
      this.dataSource.setData(userList);
      this.resetForm();
      if (updateCache) {
        this.userDataStoreService.setUsers(userList);
      }
    });
  }

  create() {

    if (this.editMode) {
      this.update();
    } else {
      this.userService.createUser(this.username.value, this.roles.value).subscribe((user: any) => {
        this.get(true);
      });
    }
  }
  resetEditMode() {
    this.editMode = false;
    this.resetForm();
  }

  edit(item: any) {

    this.username.setValue(item.username);
    this.roles.setValue(item.roles);
    this.selectedId = item.id;
    this.editMode = true;
    this.form.markAsDirty();

  }

  update() {

    this.userService.updateUser(this.selectedId, this.username.value, this.roles.value).subscribe((user: any) => {
      this.get(true);
      this.editMode = false;

    })
  }

  compare(c1: any, c2: any) {
    console.log(c1 + "  " + c2);
    return c1 && c2 && c1 === c2;
  }

  delete(item: any) {

    this.userService.deleteUser(item.id).subscribe((user: any) => {
      this.get(true);
    })
  }
  resetForm() {
    this.form.reset();
  }

  /*
  openDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialog,{
      data:{
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Save',
          cancel: 'No'
        }
      }
    });
  }
  */
  
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

