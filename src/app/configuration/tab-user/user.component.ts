import { DataSource } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { Observable, ReplaySubject } from 'rxjs';
import { UserDataStoreService } from './user.datastore.service';
import { UserService, IUser } from './user.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatMiniFabButton, MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatToolbar } from '@angular/material/toolbar';


const ELEMENT_DATA: IUser[] = [];
@Component({
    selector: 'app-rbac',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatSelect, MatOption, MatMiniFabButton, MatIcon, MatButton, MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatSortHeader, MatToolbar, MatIconButton, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
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

