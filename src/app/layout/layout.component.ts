import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BoardService } from '../board/board.service';
import { EventService } from '../eventservice/event.service';
import { layouts, LayoutType } from './layout.model';
import { NgClass } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-sidelayout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgClass, MatIconButton, MatIcon]
})
export class SidelayoutComponent implements OnInit {
  _layouts = layouts;
  selectedLayoutId = -1;
  constructor(private eventService: EventService, boardService: BoardService) {
    eventService.listenForBoardSelectedEvent().subscribe((event) => {
      //get the board and layout then get the id and set it.
      boardService.getBoardById(event.data).subscribe((board) => {
        //console.log('Board structure of the selected board!');
        //console.log(board.structure);

        layouts.forEach((layout) => {
          if (layout.structure.localeCompare(board.structure) == 0) {
            this.selectedLayoutId = layout.id;
          }
        });
      });
    });
  }

  ngOnInit(): void {}
  selectBoardLayout(structure: LayoutType, layoutId: number) {
    this.selectedLayoutId = layoutId;
    this.eventService.emitLayoutChange({ data: structure });
  }

  close() {
    this.eventService.emitBoardSideLayoutClickEvent();
  }
}
