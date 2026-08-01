import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { BoardService } from '../board/board.service';
import { Hiearchy, IBoard, IBoardCollection } from '../board/board.model';
import { EventService } from '../eventservice/event.service';
import { MatNavList, MatListItem } from '@angular/material/list';
import { SidelayoutComponent } from '../layout/layout.component';
import { BoardComponent } from '../board/board.component';
import { ConfigPanelComponent } from '../config-panel/config-panel.component';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatDrawerContainer, MatDrawer, MatNavList, MatListItem, SidelayoutComponent, BoardComponent, ConfigPanelComponent]
})
export class SidenavComponent implements OnInit {
  @ViewChild('drawer') public drawer!: MatDrawer;
  @ViewChild('layout') public layout!: MatDrawer;
  @ViewChild('configPanel') public configPanel!: MatDrawer;
  boardData: IBoard[] = [];

  selectedBoardId: number | null = null;
  private openConfigInstanceId: number = -1;

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
    if (!this.layout.opened) {
      this.configPanel.close();
    }
    this.layout.toggle();
  }

  // Bound to <mat-drawer #configPanel (closed)>. Fires whenever the drawer
  // actually finishes closing — close button, backdrop click, escape key,
  // or being closed programmatically (e.g. toggleLayout() above) — so it's
  // the single reliable place to tell the gadget that was being configured
  // to exit config mode, regardless of how the panel got closed.
  onConfigPanelClosed() {
    this.eventService.emitConfigPanelClosedEvent({ data: { instanceId: this.openConfigInstanceId } });
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

    this.eventService.listenForOpenConfigPanelEvent().subscribe((event) => {
      this.openConfigInstanceId = event.data.instanceId;
      this.layout.close();
      this.configPanel.open();
    });

    this.eventService.listenForCloseConfigPanelEvent().subscribe(() => {
      this.configPanel.close();
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
