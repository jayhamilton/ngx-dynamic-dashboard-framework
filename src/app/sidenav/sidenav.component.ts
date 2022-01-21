import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { BoardService } from '../board/board.service';
import { Heiarchy, IBoard, IBoardCollection } from '../board/board.model';
import { EventService } from '../eventservice/event.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  @ViewChild('drawer') public drawer!: MatDrawer;
  boardData: IBoard[] = [];

  showFiller = false;
  constructor(
    private eventService: EventService,
    private boardService: BoardService
  ) {
    this.loadBoards();
    this.setupEventListeners();
  }

  ngOnInit(): void {}

  toggleMenu() {
    this.drawer.toggle();
  }

  loadBoards() {
    this.boardService.getBoardCollection().subscribe((boardCollection: IBoardCollection) => {
      this.boardData = boardCollection.boardList.filter((obj)=>{

        return obj.relationship == Heiarchy.PARENT
      });
    });
  }

  showBoard(boardList: any) {
    //raise event to show the selected board
    let boardSelected = boardList.selectedOptions.selected[0]?.value;

    this.eventService.emitBoardSelectedEvent({ data: boardSelected });

    console.log('Selected Board: ' + boardSelected);
  }

  setupEventListeners() {
    this.eventService
      .listenForBoardMenuSideNavClickEvent()
      .subscribe((event) => {
        this.toggleMenu();
      });

    this.eventService
      .listenForBoardCreatedCompleteEvent()
      .subscribe((event) => {
        this.loadBoards();
      });
    this.eventService
      .listenForBoardDeletedCompleteEvent()
      .subscribe((event) => {
        this.loadBoards();
      });
  }
}
