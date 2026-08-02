import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { BoardService } from '../board/board.service';
import { Hiearchy, IBoard, IBoardCollection } from '../board/board.model';
import { EventService } from '../eventservice/event.service';
import { MatNavList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { SidelayoutComponent } from '../layout/layout.component';
import { BoardComponent } from '../board/board.component';
import { ConfigPanelComponent } from '../config-panel/config-panel.component';
import { LibraryComponent } from '../library/library.component';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatDrawerContainer, MatDrawer, MatNavList, MatListItem, MatListItemIcon, MatIcon, SidelayoutComponent, BoardComponent, ConfigPanelComponent, LibraryComponent]
})
export class SidenavComponent implements OnInit {
  @ViewChild('drawer') public drawer!: MatDrawer;
  @ViewChild('layout') public layout!: MatDrawer;
  @ViewChild('configPanel') public configPanel!: MatDrawer;
  @ViewChild('library') public library!: MatDrawer;
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
      this.library.close();
    }
    this.layout.toggle();
  }

  toggleLibrary() {
    if (!this.library.opened) {
      this.configPanel.close();
      this.layout.close();
    }
    this.library.toggle();
  }

  // Bound to (openedChange) on the two mode="side" drawers (#drawer, #layout),
  // which push/resize the board rather than overlay it. That resize is a CSS
  // transition, not a browser window resize, but ngx-charts only re-measures
  // its container on the window's native 'resize' event — so without this,
  // gadget charts stay sized for the old (drawer-open) width until an actual
  // window resize or full page reload. openedChange fires once the drawer's
  // open/close animation has finished, so the board has already reached its
  // final width by the time this dispatches.
  onPushDrawerAnimationDone() {
    window.dispatchEvent(new Event('resize'));
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
      this.library.close();
      this.configPanel.open();
    });

    this.eventService.listenForCloseConfigPanelEvent().subscribe(() => {
      this.configPanel.close();
    });

    this.eventService.listenForLibraryOpenMenuEvent().subscribe(() => {
      this.toggleLibrary();
    });

    this.eventService.listenForCloseLibraryPanelEvent().subscribe(() => {
      this.library.close();
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
