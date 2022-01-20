import { DataSource } from '@angular/cdk/table';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { BoardService, IBoard, IBoardCollection } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';

export interface IBoardNewRequestData {
  title: string;
  description: string;
  product: string;
  tabvalue: string;
}

const ELEMENT_DATA: IBoard[] = [];
@Component({
  selector: 'app-tab-boards',
  templateUrl: './tab-boards.component.html',
  styleUrls: ['./tab-boards.component.css'],
})
export class TabBoardsComponent implements OnInit {
  options: FormGroup;
  boardTitle = new FormControl();
  boardDescription = new FormControl();
  boardTabvalue = new FormControl();
  hideRequiredControl = new FormControl(false);//TODO
  floatLabelControl = new FormControl('auto');//TODO
  displayedColumns: string[] = ['title', 'product', 'description', 'tablist', 'tools'];
  dataToDisplay: IBoard[] = [...ELEMENT_DATA];
  dataSource = new ExampleDataSource(this.dataToDisplay);

  constructor(
    private eventService: EventService,
    private boardService: BoardService,
    fb: FormBuilder
  ) {
    this.options = fb.group({
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
      boardTitle: this.boardTitle,
      boardDescription: this.boardDescription,
      boardTabvalue: this.boardTabvalue
    });

    this.setupEventListeners();
    this.loadData();
  }

  ngOnInit(): void {}

  setupEventListeners() {
    this.eventService
      .listenForBoardCreatedCompleteEvent()
      .subscribe((event) => {

        //clear the input fields
        this.options.reset();

        //TODO - stop progress indicator and close dialog

        //TODO - listen for error events

        this.loadData();
      });

    this.eventService
      .listenForBoardDeletedCompleteEvent()
      .subscribe((event) => {

        //TODO - stop progress indicator and close dialog

        this.loadData();
      });
  }

  loadData() {
    this.boardService.getBoardCollection().subscribe((boardCollection: IBoardCollection) => {
      if (boardCollection.boardList.length == 0) {
        //ensure the table is cleared out
        this.dataSource.setData([]);
        this.dataToDisplay = [...[]];
      } else {
        this.dataSource.setData(boardCollection.boardList);
        this.dataToDisplay = [...boardCollection.boardList];
      }
    });
    //use the board service to get the data needed
  }

  create() {
    let boardNewRequestData: IBoardNewRequestData = {
      title: this.boardTitle.value,
      description: this.boardDescription.value,
      product: 'Armani',
      tabvalue: this.boardTabvalue.value
    }

    console.log(boardNewRequestData);
    this.eventService.emitBoardCreateRequestEvent({
      data: boardNewRequestData,
    });
    //TODO - start progress indicator
  }

  //TODO - edit
  edit(item: any) {}

  delete(item: any) {
    this.eventService.emitBoardDeleteRequestEvent({ data: item });
    //TODO - start progress indicator
  }
}

class ExampleDataSource extends DataSource<IBoard> {
  private _dataStream = new ReplaySubject<IBoard[]>();

  constructor(initialData: IBoard[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<IBoard[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: IBoard[]) {
    this._dataStream.next(data);
  }
}
