import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ConfigurationComponent } from '../configuration/configuration.component';
import { EventService } from '../eventservice/event.service';
import { LibraryComponent } from '../library/library.component';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    standalone: false
})
export class MenuComponent implements OnInit {
  visible = true;
  applicationTitle:string;
  constructor(
    public dialog: MatDialog,
    private eventService: EventService,
    private router: Router
  ) {
    this.setupEventHandlers();
    this.applicationTitle = environment.applicationTitle;
  }

  ngOnInit(): void {}

  setupEventHandlers() {
    this.eventService.listenForLibraryOpenMenuEvent().subscribe(() => {
      this.openGadgetLibraryDialog();
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

  logout() {
    sessionStorage.removeItem(environment.sessionToken);
    this.router.navigateByUrl('');
  }
}
