import { Component, OnInit } from '@angular/core';
import { EventService } from '../eventservice/event.service';
import { layouts, LayoutType } from './layout.model';

@Component({
  selector: 'app-sidelayout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class SidelayoutComponent implements OnInit {
  _layouts = layouts;
  selectedLayoutId = -1;
  constructor(private eventService: EventService) {

    eventService.listenForBoardSelectedEvent().subscribe((board)=>{

      console.log("Board selected so select layout");
      console.log(board);

    });
  }

  ngOnInit(): void {}
  selectBoardLayout(structure: LayoutType, layoutId: number) {
    this.selectedLayoutId = layoutId;
    this.eventService.emitLayoutChange({ data: structure });
  }
}
