import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ConfigurationComponent } from '../configuration/configuration.component';
import { EventService } from '../eventservice/event.service';
import { ThemeService } from '../theme/theme.service';
import { AppConfigService } from '../app-config/app-config.service';
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
export class MenuComponent {
  visible = true;

  constructor(
    public dialog: MatDialog,
    private eventService: EventService,
    private router: Router,
    public themeService: ThemeService,
    public appConfigService: AppConfigService
  ) { }

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

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    sessionStorage.removeItem(environment.sessionToken);
    this.router.navigateByUrl('');
  }
}
