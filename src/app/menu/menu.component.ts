import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ConfigurationComponent } from '../configuration/configuration.component';
import { EventService } from '../eventservice/event.service';
import { LibraryComponent } from '../library/library.component';
import { BoardService } from '../board/board.service';
import { IBoard } from '../board/board.model';
import { ThemeService } from '../theme/theme.service';
import { MatToolbar } from '@angular/material/toolbar';
import { RbacDirective } from '../_authorization/rbac.directive';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatToolbar, RbacDirective, MatIconButton, MatIcon, AsyncPipe]
})
export class MenuComponent implements OnInit {
  visible = true;
  applicationTitle: string;
  boardTitle: string = '';

  constructor(
    public dialog: MatDialog,
    private eventService: EventService,
    private boardService: BoardService,
    private router: Router,
    public themeService: ThemeService
  ) {
    this.setupEventHandlers();
    this.applicationTitle = environment.applicationTitle;
  }

  ngOnInit(): void {
    this.boardService.getLastSelectedBoard().subscribe((board: IBoard) => {
      if (board?.title) this.boardTitle = board.title;
    });
  }

  setupEventHandlers() {
    this.eventService.listenForLibraryOpenMenuEvent().subscribe(() => {
      this.openGadgetLibraryDialog();
    });

    this.eventService.listenForBoardSelectedEvent().subscribe((event) => {
      this.boardService.getBoardById(event.data).subscribe((board: IBoard) => {
        if (board?.title) this.boardTitle = board.title;
      });
    });
  }
  openConfigDialog() {
    this.dialog.open(ConfigurationComponent, {
      width: '1000px',
    });
  }

  openGadgetLibraryDialog() {
    this.dialog.open(LibraryComponent, {
      width: '700px',
    });
  }

  toggleMenu() {
    this.eventService.emitBoardMenuSideNavClickEvent();
  }

  toggleLayout() {
    this.eventService.emitBoardSideLayoutClickEvent();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    sessionStorage.removeItem(environment.sessionToken);
    this.router.navigateByUrl('');
  }
}
