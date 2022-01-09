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
  noBoardsHaveBeenCreated: boolean;

  constructor(
    private eventService: EventService,
    private boardService: BoardService
  ) {
    this.noBoardsHaveBeenCreated = true;
    this.setupCreateBoardEventListener();
    this.setupDeleteBoardEventListener();
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

  /**
   * Board Display Section
   */
  displayBoard() {

    //getBoardData
    this.boardService.getLastSelectedBoard().subscribe((boardData: IBoard) => {

      if(boardData.id === -10){//TODO fix the return info. This represents no board data exists
        this.noBoardsHaveBeenCreated = true;
        this.clearDisplay();
      }else{
        this.noBoardsHaveBeenCreated = false ;
        this.show(boardData);
      }

      this.boardData = boardData;

    });
  }

  show(data: IBoard) {
    const gridHost = this.gadgetGridHost.viewContainerRef;
    this.clearDisplay();

    //todo create a gadget based on the incoming data
    gridHost.createComponent(ProductComponent);
    gridHost.createComponent(ImageComponent);

    //set instance config
  }

  clearDisplay(){
    const gridHost = this.gadgetGridHost.viewContainerRef;
    gridHost.clear();
  }

}
