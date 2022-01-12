import { Component, OnInit, ViewChild } from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { ImageComponent } from '../gadgets/image/image.component';
import { BoardGridDirective } from './boardgrid.directive';
import { ProductComponent } from '../gadgets/product/product.component';
import { IEvent, EventService } from '../eventservice/event.service';
import { BoardService, IBoard } from './board.service';
import { animate, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  animations: [
    trigger('showHide', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class BoardComponent implements OnInit {
  @ViewChild(BoardGridDirective, { static: true })
  gadgetGridHost!: BoardGridDirective;

  boardData!: IBoard;
  boardExists: boolean;
  boardHasGadgets: boolean;

  constructor(
    private eventService: EventService,
    private boardService: BoardService
  ) {
    this.boardExists = false;
    this.boardHasGadgets = false;
    this.setupBoardEventListeners();
  }

  ngOnInit(): void {
    this.displayLastSelectedBoard();
  }

  /**
   * Event Listners
   */
  setupBoardEventListeners() {
    this.eventService
      .listenForBoardCreatedCompleteEvent()
      .subscribe((event: IEvent) => {
        this.displayLastSelectedBoard();
      });

    this.eventService
      .listenForBoardDeletedCompleteEvent()
      .subscribe((event: IEvent) => {
        this.displayLastSelectedBoard();
      });

    this.eventService
      .listenForBoardSelectedEvent()
      .subscribe((event: IEvent) => {
        this.displayNavSelectedBoard(event);
      });
  }

  /**
   * Board Display Section
   */
   displayLastSelectedBoard() {
    //getBoardData
    this.boardService
      .getLastSelectedBoard()
      .subscribe((boardData: IBoard) => {
        this.prepareToShow(boardData);
    });
  }

  /**
   * Board Display Section
   */
  displayNavSelectedBoard(board: IEvent) {
    //getBoardData
    this.boardService
      .getNavSelectedBoard(board)
      .subscribe((boardData: IBoard) => {
        this.prepareToShow(boardData);
      });
  }

  prepareToShow(boardData: IBoard) {
    this.boardData = boardData;
    this.boardExists = this.doesABoardExist();

    if (this.boardExists) {
      this.boardHasGadgets = this.doesTheBoardHaveGadgets();
      this.show();
    } else {
      this.clearDisplay();
    }
  }

  show() {
    //use this.boardData to render components
    const gridHost = this.gadgetGridHost.viewContainerRef;
    this.clearDisplay();

    if (this.boardHasGadgets) {

      //walk the board structure to find gadgets to display
      this.boardData.rows.forEach((object) => {
        object.columns.forEach((object) => {
          object.gadgets.forEach((gadgetProperties) => {
            const gadgetRef = gridHost.createComponent(
              this.getComponentType(gadgetProperties.componentType)
            );
            gadgetRef.instance.setConfiguration(gadgetProperties);
          });
        });
      });
      this.boardHasGadgets = true;
    }
  }

  public addGadget(gadget: any) {
    console.log('ADDING GADGET');
    //send this.boardData along with gadget to boardservice to persist the model
    //that should raise an add gadget completed event that should cause a rerendering of the board.
  }

  clearDisplay() {
    const gridHost = this.gadgetGridHost.viewContainerRef;
    gridHost.clear();
  }

  doesABoardExist() {
    return this.boardData.id !== -10; //TODO - not a good way to determine if a board exists. Fix This.
  }

  doesTheBoardHaveGadgets() {
    return (
      this.boardData.rows[0].columns[0].gadgets.length !== 0 ||
      this.boardData.rows[0].columns[1].gadgets.length !== 0
    );
  }

  getComponentType<ComponentBase>(componentTypeString: string) {
    return ProductComponent;
  }
}
