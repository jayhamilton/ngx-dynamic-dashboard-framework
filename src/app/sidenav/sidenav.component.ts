import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { BoardService } from '../board/board.service';
import { Hiearchy, IBoard, IBoardCollection } from '../board/board.model';
import { EventService } from '../eventservice/event.service';
import { MatNavList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { SidelayoutComponent } from '../layout/layout.component';
import { BoardComponent } from '../board/board.component';
import { ConfigPanelComponent } from '../config-panel/config-panel.component';
import { LibraryComponent } from '../library/library.component';
import { HelpPanelComponent } from '../help-panel/help-panel.component';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatDrawerContainer, MatDrawer, MatNavList, MatListItem, MatListItemIcon, MatIcon, MatTooltip, SidelayoutComponent, BoardComponent, ConfigPanelComponent, LibraryComponent, HelpPanelComponent]
})
export class SidenavComponent implements OnInit {
  @ViewChild('drawer') public drawer!: MatDrawer;
  @ViewChild('layout') public layout!: MatDrawer;
  @ViewChild('configPanel') public configPanel!: MatDrawer;
  @ViewChild('library') public library!: MatDrawer;
  @ViewChild('helpPanel') public helpPanel!: MatDrawer;
  boardData: IBoard[] = [];

  selectedBoardId: number | null = null;
  private openConfigInstanceId: number = -1;

  // The left nav (#drawer) is always visible; toggling switches it between
  // a full width rail (icon + title) and a narrow icon-only rail, rather
  // than showing/hiding it entirely.
  navExpanded = false;

  constructor(
    private eventService: EventService,
    private boardService: BoardService
  ) {
    this.loadBoards();
    this.setupEventListeners();
  }

  ngOnInit(): void { }

  toggleMenu() {
    this.navExpanded = !this.navExpanded;
  }

  toggleLayout() {
    if (!this.layout.opened) {
      this.configPanel.close();
      this.library.close();
      this.helpPanel.close();
    }
    this.layout.toggle();
  }

  toggleLibrary() {
    if (!this.library.opened) {
      this.configPanel.close();
      this.layout.close();
      this.helpPanel.close();
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

  // #drawer no longer opens/closes (it's always [opened]="true") — expanding
  // and collapsing the icon rail instead animates its `width` via a plain
  // CSS transition, which never fires (openedChange). Native `transitionend`
  // is the equivalent "animation actually finished" signal for that case, so
  // gadget charts still get resized once the board reaches its final width.
  onNavRailTransitionEnd(event: TransitionEvent) {
    if (event.propertyName === 'width') {
      this.onPushDrawerAnimationDone();
    }
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

      if (this.boardData.length === 0) {
        // Nothing left for the library/layout/config panels to act on —
        // most reachable by deleting the last remaining board while one of
        // them is open. Optional chaining: this also runs from the
        // constructor, before the drawer ViewChildren exist yet.
        this.layout?.close();
        this.library?.close();
        this.configPanel?.close();
        this.helpPanel?.close();
      }

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
      this.helpPanel.close();
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

    this.eventService.listenForOpenHelpPanelEvent().subscribe(() => {
      this.layout.close();
      this.library.close();
      this.configPanel.close();
      this.helpPanel.open();
    });

    this.eventService.listenForCloseHelpPanelEvent().subscribe(() => {
      this.helpPanel.close();
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
