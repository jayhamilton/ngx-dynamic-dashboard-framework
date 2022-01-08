import { DataSource } from '@angular/cdk/table';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { EventService } from 'src/app/eventservice/event.service';

export interface IBoardItem {
  name: string;
  description: string;
  product: string;

}

const ELEMENT_DATA: IBoardItem[] = [
  { name: 'Packaging line 1', description: 'Main packaging line next to the warehouse exit', product: 'Armani'},
];
@Component({
  selector: 'app-tab-boards',
  templateUrl: './tab-boards.component.html',
  styleUrls: ['./tab-boards.component.css'],
})
export class TabBoardsComponent implements OnInit {

  options: FormGroup;
  boardName = new FormControl();
  boardDescription = new FormControl();
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto');

  constructor(private eventService: EventService, fb: FormBuilder) {
    this.options = fb.group({
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
      boardName: this.boardName,
      boardDescription: this.boardDescription
    });
  }

  ngOnInit(): void {}

  displayedColumns: string[] = ['name',  'product', 'description', 'tools'];
  dataToDisplay = [...ELEMENT_DATA];

  dataSource = new ExampleDataSource(this.dataToDisplay);

  create() {

    let boardData:IBoardItem = { name: this.boardName.value, description: this.boardDescription.value, product: 'Armani'};
    this.dataToDisplay = [...this.dataToDisplay, boardData];
    this.dataSource.setData(this.dataToDisplay);
    this.eventService.raiseConfigurationRequestEvent({name:'boardCreateRequestEvent', data: boardData});

    //TODO - start progress indicator

    this.eventService.listenForConfigurationCompletedEvents().subscribe(event  =>{

      if(event.name === 'boardCreateCompletedEvent'){

        //TODO - stop progress indicator and close dialog
      }

      //TODO - listen for error events

    });
  }

  edit(item: any) {
  }

  delete(item: any) {
    //get index by name and remove
    this.dataToDisplay = this.dataToDisplay.slice(0, -1);
    this.dataSource.setData(this.dataToDisplay);
  }
}

class ExampleDataSource extends DataSource<IBoardItem> {
  private _dataStream = new ReplaySubject<IBoardItem[]>();

  constructor(initialData: IBoardItem[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<IBoardItem[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: IBoardItem[]) {
    this._dataStream.next(data);
  }
}
