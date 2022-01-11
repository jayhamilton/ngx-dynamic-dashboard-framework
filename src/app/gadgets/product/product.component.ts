import { DataSource } from '@angular/cdk/table';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { GadgetBase } from '../gadget.base';


export interface ComponentItem {
  id: number;
  measure: number;
  description: string;
  product: string;

}

const ELEMENT_DATA: ComponentItem[] = [
  { id: 28462800, measure: 1.00, description: 'Rouge D\'Armani Beige 103', product: 'Armani'},
  { id: 61490200, measure: 1.00, description: 'Rouge D\'Armani Rouge 400', product: 'Armani'},
];
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent extends GadgetBase implements OnInit {


  options: FormGroup;
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto');


  constructor( fb: FormBuilder) {
    super();
    this.options = fb.group({
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
    });
  }

  ngOnInit(): void {}

  displayedColumns: string[] = ['id',  'measure', 'description', 'tools'];
  dataToDisplay = [...ELEMENT_DATA];

  dataSource = new ExampleDataSource(this.dataToDisplay);

  addData() {
    const randomElementIndex = Math.floor(Math.random() * ELEMENT_DATA.length);
    this.dataToDisplay = [...this.dataToDisplay, ELEMENT_DATA[randomElementIndex]];
    this.dataSource.setData(this.dataToDisplay);

    this.create("test");
  }

  removeData() {
    this.dataToDisplay = this.dataToDisplay.slice(0, -1);
    this.dataSource.setData(this.dataToDisplay);
  }

  create(name: string) {
    if (name !== '') {
    }
  }

  edit(name: string) {
    "";
  }

  delete(name: string) {
    "";
  }
}

class ExampleDataSource extends DataSource<ComponentItem> {
  private _dataStream = new ReplaySubject<ComponentItem[]>();

  constructor(initialData: ComponentItem[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<ComponentItem[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: ComponentItem[]) {
    this._dataStream.next(data);
  }
}
