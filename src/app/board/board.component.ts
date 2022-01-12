import { Component, ComponentRef, OnInit, ViewChild } from '@angular/core';
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
import { IGadget } from '../gadgets/gadget.model';
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
        this.displayNavSelectedBoard(event.data); //boardId
      });

    this.eventService
      .listenForLibraryAddGadgetEvents()
      .subscribe((event: IEvent) => {
        this.addGadget(event.data); //IGadget
      });
  }

  /**
   * Display last selected board
   * after the browser is launched or
   * if a new board is created. When a new board is created
   * that new board becomes the last selected board.
   */
  displayLastSelectedBoard() {
    //getBoardData
    this.boardService.getLastSelectedBoard().subscribe((boardData: IBoard) => {
      this.prepareToShow(boardData);
    });
  }

  /**
   * Display board based on navigation menu selection event
   */
  displayNavSelectedBoard(boardId: number) {
    //getBoardData
    this.boardService.getBoardById(boardId).subscribe((boardData: IBoard) => {
      this.prepareToShow(boardData);
    });
  }
  /**
   * Rudimentary board state management. this.boardData and this.boardExists
   * will determine what instructions/actions to display on the board.
   * @param boardData
   */
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

  /**
   *  walk the board structure to find gadgets to display
   */
  show() {
    //use this.boardData to render components
    this.clearDisplay();

    if (this.boardHasGadgets) {
      this.boardData.rows.forEach((rowData) => {
        rowData.columns.forEach((columnData) => {
          columnData.gadgets.forEach((gadgetData) => {
            this.addGadget(gadgetData);
          });
        });
      });
    }
  }

  public addGadget(gadgetData: IGadget) {
    console.log('ADDING GADGET');
    const gridHost = this.gadgetGridHost.viewContainerRef;

     //TODO refactor and move to seperate clases
    switch(gadgetData.componentType){
      case "ProductComponent":{
        this.createProductComponent(gadgetData);
        break;
      }
      case "ImageComponent":{
        this.createImageComponent(gadgetData);
        break;
      }
    }

    this.boardHasGadgets = true;
    //send this.boardData along with gadget to boardservice to persist the model
    //that should raise an add gadget completed event that should cause a rerendering of the board.
  }

  //TODO refactor and move to seperate clases
  createProductComponent(gadgetData:IGadget){

      const gridHost = this.gadgetGridHost.viewContainerRef;
      const gadgetRef = gridHost.createComponent(ProductComponent);
      gadgetRef.instance.setConfiguration(gadgetData);

  }

   //TODO refactor and move to seperate clases
  createImageComponent(gadgetData:IGadget){

    const gridHost = this.gadgetGridHost.viewContainerRef;
    const gadgetRef = gridHost.createComponent(ImageComponent);
    gadgetRef.instance.setConfiguration(gadgetData);


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
}
