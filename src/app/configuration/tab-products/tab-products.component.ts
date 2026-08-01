import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable, ReplaySubject} from 'rxjs';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

export interface ProductItem {
  name: string;
  position: number;
  description: string;
  date: string;
}

const ELEMENT_DATA: ProductItem[] = [
  {position: 1, name: 'Armoni', date: '12/10/2021', description: 'Armoni box set'},
];
@Component({
    selector: 'app-tab-products',
    templateUrl: './tab-products.component.html',
    styleUrls: ['./tab-products.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatToolbar, MatIconButton, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatMiniFabButton]
})
export class TabProductsComponent  {

  displayedColumns: string[] = ['position', 'name', 'date', 'description', 'tools'];
  dataToDisplay = [...ELEMENT_DATA];

  dataSource = new ExampleDataSource(this.dataToDisplay);

  options: UntypedFormGroup;
  hideRequiredControl = new UntypedFormControl(false);
  floatLabelControl = new UntypedFormControl('auto');

  constructor(fb: UntypedFormBuilder){
    this.options = fb.group({
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
    });
  }

  addData() {
    const randomElementIndex = Math.floor(Math.random() * ELEMENT_DATA.length);
    this.dataToDisplay = [...this.dataToDisplay, ELEMENT_DATA[randomElementIndex]];
    this.dataSource.setData(this.dataToDisplay);
  }

  removeData() {
    this.dataToDisplay = this.dataToDisplay.slice(0, -1);
    this.dataSource.setData(this.dataToDisplay);
  }
}

class ExampleDataSource extends DataSource<ProductItem> {
  private _dataStream = new ReplaySubject<ProductItem[]>();

  constructor(initialData: ProductItem[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<ProductItem[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: ProductItem[]) {
    this._dataStream.next(data);
  }
}
