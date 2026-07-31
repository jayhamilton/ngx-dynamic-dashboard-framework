import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { BoardService } from '../board/board.service';
import { Hiearchy, IBoard, IBoardCollection } from '../board/board.model';
import { EventService } from '../eventservice/event.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SidenavComponent implements OnInit {
  @ViewChild('drawer') public drawer!: MatDrawer;
  @ViewChild('layout') public layout!: MatDrawer;
  boardData: IBoard[] = [];

  selectedBoardId: number | null = null;

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
        return obj.relationship == Hiearchy.PARENT;
      });
      if (!this.selectedBoardId) {
        this.boardService.getLastSelectedBoard().subscribe((board: IBoard) => {
          if (board && board.id != null) {
            this.selectedBoardId = board.id;
          } else if (this.boardData.length > 0) {
            this.selectedBoardId = this.boardData[0].id;
          }
        });
      }
    });
  }

  selectBoard(boardId: number) {
    this.selectedBoardId = boardId;
    this.eventService.emitBoardSelectedEvent({ data: boardId });
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

    this.eventService.listenForBoardSelectedEvent().subscribe((event) => {
      this.selectedBoardId = event.data;
    });
  }
}
