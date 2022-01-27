import { Component, OnInit } from '@angular/core';
import { EventService } from '../eventservice/event.service';
import { LayoutType } from './sidelayout.service';
import { layouts } from './layout.model';

@Component({
  selector: 'app-sidelayout',
  templateUrl: './sidelayout.component.html',
  styleUrls: ['./sidelayout.component.css'],
})
export class SidelayoutComponent implements OnInit {
  _layouts = layouts;
  selectedLayoutId = -1;
  constructor(private eventService: EventService) {}

  ngOnInit(): void {}
  selectBoardLayout(structure: LayoutType, layoutId: number) {
    this.selectedLayoutId = layoutId;
    this.eventService.emitLayoutChange({ data: structure });
  }
}
