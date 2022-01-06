import { DataSource } from '@angular/cdk/table';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';


export interface ComponentItem {
  id: number;
  measure: number;
  description: string;
  product: string;

}

const ELEMENT_DATA: ComponentItem[] = [
  { id: 28462800, measure: 1.00, description: 'Main production line next to the warehouse exit', product: 'Armani'},
];
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {


  options: FormGroup;
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto');


  constructor( fb: FormBuilder) {
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
      //this.eventService.raiseConfigurationEvent({name:'create', data: {}});
    }
    console.log(
      'Creating new board event from configuration component: ' + name
    );
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
