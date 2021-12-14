import { Component, OnInit } from '@angular/core';
import {MenuEventService} from './menu-service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private _menuEventService: MenuEventService) { }

  ngOnInit(): void {
  }

  emitMenuEvent(eventData: string) {

    switch (eventData){
      case "create":
        this._menuEventService.raiseMenuEvent({name: 'createEvent', data: eventData});
        break;
      case "config":
        this._menuEventService.raiseMenuEvent({name: 'configEvent', data: eventData});
        break;
      default:
    }
}

}
