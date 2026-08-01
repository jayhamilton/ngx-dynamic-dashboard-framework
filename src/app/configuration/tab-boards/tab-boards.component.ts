import { DataSource } from '@angular/cdk/table';
import { Component, EventEmitter, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import {
  Hiearchy,
  IBoard,
  IBoardCollection,
} from 'src/app/board/board.model';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';

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
    styleUrls: ['./tab-boards.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatSelect, MatOption, MatButton, MatIcon, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatIconButton, MatTooltip, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})
export class TabBoardsComponent implements OnInit {

  @Output() boardAddEvent: EventEmitter<string> = new EventEmitter<string>();


  form: UntypedFormGroup;
  boardTitle = new UntypedFormControl();
  boardDescription = new UntypedFormControl();
  boardTabvalue = new UntypedFormControl();
  hideRequiredControl = new UntypedFormControl(false); //TODO
  floatLabelControl = new UntypedFormControl('auto'); //TODO
  displayedColumns: string[] = ['title', 'description', 'tools'];
  dropDownListSelection: IBoard[] = [];
  dataSource = new ExampleDataSource(ELEMENT_DATA);
  selectedId?: number;
  editMode = false;

  constructor(
    private eventService: EventService,
    private boardService: BoardService,
    private dialog: MatDialog,
    fb: UntypedFormBuilder
  ) {
    this.form = fb.group({
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
      boardTitle: this.boardTitle,
      boardDescription: this.boardDescription,
      boardTabvalue: this.boardTabvalue,
    });

    this.setupEventListeners();
    this.loadData();
  }

  ngOnInit(): void { }

  setupEventListeners() {
    this.eventService
      .listenForBoardCreatedCompleteEvent()
      .subscribe((event) => {
        //clear the input fields
        this.form.reset();

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

    this.resetForm();

    this.boardService
      .getBoardCollection()
      .subscribe((boardCollection: IBoardCollection) => {
        if (boardCollection.boardList.length == 0) {
          //ensure the table is cleared out
          this.dataSource.setData([]);
          this.dropDownListSelection = [...[]];
        } else {
          //Pair up parent and child entries so they appear together

          //TODO move this to the service

          let list: IBoard[] = [];

          boardCollection.boardList.forEach((board) => {
            if (board.relationship === Hiearchy.PARENT) {
              list.push(board);
              board.tabs.forEach((tab) => {
                boardCollection.boardList.forEach((_board) => {
                  if (
                    tab.id == _board.id &&
                    _board.relationship === Hiearchy.CHILD
                  ) {
                    list.push(_board);
                  }
                });
              });
            }
          });

          this.dataSource.setData(list);

          /**
           * TODO - dataToDisplay is used for the drop down list
           * modify this list such that board as tab candidates are only those
           * that are parent where there is 0 or 1 id in the tab array and the id in that
           * array matches the board id.
           * **/
          let dropDownList: IBoard[] = [];

          list.forEach((board) => {

            if (board.relationship === Hiearchy.PARENT && board.tabs.length == 1 && board.tabs[0].id == board.id) {
              dropDownList.push(board);
            }

          });

          this.dropDownListSelection = [...dropDownList];
        }
      });
    //use the board service to get the data needed
  }

  create() {
    
    if (this.editMode) {
      this.update();
    } else {
    
    let boardNewRequestData: IBoardNewRequestData = {
      title: this.boardTitle.value,
      description: this.boardDescription.value,
      product: '',
      tabvalue: this.boardTabvalue.value,
    };

    this.eventService.emitBoardCreateRequestEvent({
      data: boardNewRequestData,
    });
    
    //TODO - start progress indicator

    this.boardAddEvent.emit("");

  }
  }

  //TODO - edit
  edit(item: any) {

    this.boardTitle.setValue(item['title']);
    this.boardDescription.setValue(item['description']);
    this.editMode = true;
    this.selectedId = item.id;
    this.editMode = true;
    this.form.markAsDirty();
  }

  update() {

    this.eventService.emitBoardUpdateNameDescription(
      {
        data:
        {
          id: this.selectedId,
          title: this.boardTitle.value,
          description: this.boardDescription.value
        }
      });

      this.editMode = false;
      this.loadData();
  }

  delete(item: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        title: 'Delete Board',
        message: `Delete board "${item.title}"? This cannot be undone.`,
        confirmLabel: 'Delete',
      }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) this.eventService.emitBoardDeleteRequestEvent({ data: item });
    });
  }
  resetEditMode() {
    this.editMode = false;
    this.resetForm();
  }

  resetForm() {
    this.form.reset();
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

  disconnect() { }

  setData(data: IBoard[]) {
    this._dataStream.next(data);
  }
}
