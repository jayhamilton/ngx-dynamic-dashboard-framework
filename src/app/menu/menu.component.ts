import { Component, OnInit } from '@angular/core';
import { MenuEventService} from './menu.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationComponent } from '../configuration/configuration.component';
import { LibraryComponent } from '../library/library.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private _menuEventService: MenuEventService, public dialog:MatDialog) { }

  ngOnInit(): void {
  }

  menuClickEvent(eventData: string) {

    switch (eventData){
      case "create":
        //this._menuEventService.raiseMenuEvent({name: 'createEvent', data: eventData});
        this.openGadgetLibraryDialog();
        break;
      case "config":
        //this._menuEventService.raiseMenuEvent({name: 'configEvent', data: eventData});
        this.openConfigDialog();
        break;
      default:
    }
}

  openConfigDialog() {
    this.dialog.open(ConfigurationComponent,{
      width: '1000px',

    });
  }

  openGadgetLibraryDialog(){

    this.dialog.open(LibraryComponent,{
      width: '700px'
    });
  }
}

