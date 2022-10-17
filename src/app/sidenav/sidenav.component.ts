import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { BoardService } from '../board/board.service';
import { Hiearchy, IBoard, IBoardCollection } from '../board/board.model';
import { EventService } from '../eventservice/event.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  @ViewChild('drawer') public drawer!: MatDrawer;
  @ViewChild('layout') public layout!: MatDrawer;
  boardData: IBoard[] = [];

  showFiller = false;
  constructor(
    private eventService: EventService,
    private boardService: BoardService
  ) {
    this.loadBoards();
    this.setupEventListeners();
  }

  ngOnInit(): void { }

  toggleMenu() {
    this.drawer.toggle();
  }

  toggleLayout() {
    this.layout.toggle();
  }

  loadBoards() {
    this.boardService.getBoardCollection().subscribe((boardCollection: IBoardCollection) => {
      this.boardData = boardCollection.boardList.filter((obj) => {

        return obj.relationship == Hiearchy.PARENT
      });
    });
  }

  showBoard(boardList: any) {
    //raise event to show the selected board
    let boardSelected = boardList.selectedOptions.selected[0]?.value;

    this.eventService.emitBoardSelectedEvent({ data: boardSelected });

  }

  setupEventListeners() {
    this.eventService
      .listenForBoardMenuSideNavClickEvent()
      .subscribe((event) => {
        this.toggleMenu();
      });

    this.eventService
      .listenForBoardSideLayoutEvent().subscribe((event) => {
        this.toggleLayout();
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
    this.eventService.listenForBoardUpdateNameDescriptionRequestEvent().subscribe((event) => {

     this.loadBoards();

    });
  }
}
