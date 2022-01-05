import { DataSource } from '@angular/cdk/table';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { EventService } from 'src/app/eventservice/event.service';

export interface BoardItem {
  name: string;
  description: string;
  product: string;

}

const ELEMENT_DATA: BoardItem[] = [
  { name: 'Production line 1', description: 'Main production line next to the warehouse exit', product: 'Armani'},
];
@Component({
  selector: 'app-tab-boards',
  templateUrl: './tab-boards.component.html',
  styleUrls: ['./tab-boards.component.css'],
})
export class TabBoardsComponent implements OnInit {
  options: FormGroup;
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto');


  constructor(private eventService: EventService, fb: FormBuilder) {
    this.options = fb.group({
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
    });
  }

  ngOnInit(): void {}

  displayedColumns: string[] = ['name',  'product', 'description', 'tools'];
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
      this.eventService.raiseConfigurationEvent({name:'create', data: {}});
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

class ExampleDataSource extends DataSource<BoardItem> {
  private _dataStream = new ReplaySubject<BoardItem[]>();

  constructor(initialData: BoardItem[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<BoardItem[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: BoardItem[]) {
    this._dataStream.next(data);
  }
}
