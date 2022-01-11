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

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
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
    this.setupCreateBoardEventListener();
    this.setupDeleteBoardEventListener();
    this.setupBoardSelectEventListner();
  }

  ngOnInit(): void {
    this.displayBoard();
  }

  /**
   * Event Listners
   */
  setupCreateBoardEventListener() {
    this.eventService
      .listenForBoardCreatedCompleteEvent()
      .subscribe((event: IEvent) => {
        this.displayBoard();
      });
  }
  setupDeleteBoardEventListener() {
    this.eventService
      .listenForBoardDeletedCompleteEvent()
      .subscribe((event: IEvent) => {
        this.displayBoard();
      });
  }

  setupBoardSelectEventListner(){
    this.eventService.listenForBoardSelectedEvent().subscribe((event: IEvent)=>{
      this.displayNavSelectedBoard(event);
    })
  }

  /**
   * Board Display Section
   */
  displayBoard() {
    //getBoardData
    this.boardService.getLastSelectedBoard().subscribe((boardData: IBoard) => {
      this.boardData = boardData;
      this.boardExists = this.doesABoardExist();

      if (this.boardExists) {
        this.boardHasGadgets = this.doesTheBoardHaveGadgets();
        this.show();
      } else {
        this.clearDisplay();
      }
    });
  }

  /**
   * Board Display Section
   */
   displayNavSelectedBoard(board:IEvent) {
    //getBoardData
    this.boardService.getNavSelectedBoard(board).subscribe((boardData: IBoard) => {
      this.boardData = boardData;
      this.boardExists = this.doesABoardExist();

      if (this.boardExists) {
        this.boardHasGadgets = this.doesTheBoardHaveGadgets();
        this.show();
      } else {
        this.clearDisplay();
      }
    });
  }

  show() {
    //use this.boardData to render components
    const gridHost = this.gadgetGridHost.viewContainerRef;
    this.clearDisplay();
    console.log("Displaying board: " + this.boardData.title);

    if (this.boardHasGadgets) {
      //TODO - call add gadget
      gridHost.createComponent(ProductComponent);
      gridHost.createComponent(ImageComponent);
    }

    //set instance config
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
    return this.boardData.id !== -10;//TODO - not a good way to determine if a board exists. Fix This.
  }

  doesTheBoardHaveGadgets() {
    return this.boardData.rows[0].columns[0].gadgets.length !== 0 || this.boardData.rows[0].columns[1].gadgets.length !== 0
  }
}
