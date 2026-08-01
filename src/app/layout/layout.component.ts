import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BoardService } from '../board/board.service';
import { IBoard } from '../board/board.model';
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
    // Seed selection from whichever board is already active — the initial
    // default board on app load never fires a BoardSelectedEvent (that only
    // happens when the user clicks a board in the nav list), so without this
    // the panel would show nothing selected until the user switched boards.
    boardService.getLastSelectedBoard().subscribe((board) => {
      this.updateSelectedLayoutFromBoard(board);
    });

    eventService.listenForBoardSelectedEvent().subscribe((event) => {
      boardService.getBoardById(event.data).subscribe((board) => {
        this.updateSelectedLayoutFromBoard(board);
      });
    });
  }

  private updateSelectedLayoutFromBoard(board: IBoard) {
    if (!board) return;
    layouts.forEach((layout) => {
      if (layout.structure.localeCompare(board.structure) == 0) {
        this.selectedLayoutId = layout.id;
      }
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
