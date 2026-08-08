import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ConfigurationComponent } from '../configuration/configuration.component';
import { EventService } from '../eventservice/event.service';
import { ThemeService } from '../theme/theme.service';
import { AppConfigService } from '../app-config/app-config.service';
import { BoardService } from '../board/board.service';
import { BoardType, IBoard } from '../board/board.model';
import { MatToolbar } from '@angular/material/toolbar';
import { RbacDirective } from '../_authorization/rbac.directive';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatToolbar, RbacDirective, MatIconButton, MatIcon, AsyncPipe, MatTooltip]
})
export class MenuComponent {
  visible = true;

  // The gadget library and layout panel both operate on "the current
  // board" — with none created yet there's nothing for either to act on,
  // so both stay disabled until the first board exists (created via the
  // settings dialog, which is why that icon is never gated).
  boardExists = false;
  agentPanelOpen = false;
  locked$: Observable<boolean>;

  constructor(
    public dialog: MatDialog,
    private eventService: EventService,
    private router: Router,
    public themeService: ThemeService,
    public appConfigService: AppConfigService,
    private boardService: BoardService
  ) {
    this.locked$ = this.boardService.locked$;
    this.refreshBoardExists();

    this.eventService.listenForBoardCreatedCompleteEvent().subscribe(() => {
      this.refreshBoardExists();
    });

    this.eventService.listenForBoardDeletedCompleteEvent().subscribe(() => {
      this.refreshBoardExists();
    });

    this.eventService.listenForCloseAgentPanelEvent().subscribe(() => {
      this.agentPanelOpen = false;
    });
  }

  private refreshBoardExists() {
    this.boardService.getLastSelectedBoard().subscribe((board: IBoard) => {
      this.boardExists = board?.id !== BoardType.EMPTYBOARDCOLLECTION;
    });
  }

  openConfigDialog() {
    this.dialog.open(ConfigurationComponent, {
      width: '1100px',
      // MDC's dialog surface defaults to max-width: 560px regardless of the
      // `width` above, which was silently clamping this dialog — override
      // it explicitly, capped to the viewport for narrow windows.
      maxWidth: '95vw',
    });
  }

  toggleLibraryPanel() {
    this.eventService.emitLibraryMenuOpenEvent();
  }

  toggleMenu() {
    this.eventService.emitBoardMenuSideNavClickEvent();
  }

  toggleLayout() {
    this.eventService.emitBoardSideLayoutClickEvent();
  }

  toggleAgentPanel() {
    if (this.agentPanelOpen) {
      this.eventService.emitCloseAgentPanelEvent();
      this.agentPanelOpen = false;
      return;
    }

    this.agentPanelOpen = true;
    this.eventService.emitOpenAgentPanelEvent();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleLocked() {
    this.boardService.toggleLocked();
  }

  logout() {
    sessionStorage.removeItem(environment.sessionToken);
    this.router.navigateByUrl('');
  }
}
