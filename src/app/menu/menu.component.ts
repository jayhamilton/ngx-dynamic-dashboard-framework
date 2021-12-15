import { Component, OnInit } from '@angular/core';
import { MenuEventService} from './menu-service';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationComponent } from '../configuration/configuration.component';

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
        break;
      case "config":
        //this._menuEventService.raiseMenuEvent({name: 'configEvent', data: eventData});
        this.openDialog();
        break;
      default:
    }
}

  openDialog() {
    this.dialog.open(ConfigurationComponent,{
      width: '700px'
    });
  }
}

