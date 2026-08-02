import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { BoardService } from '../board/board.service';
import { IBoard } from '../board/board.model';
import { EventService } from '../eventservice/event.service';

@Component({
    selector: 'app-board-banner',
    templateUrl: './board-banner.component.html',
    styleUrls: ['./board-banner.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatIcon]
})
export class BoardBannerComponent implements OnInit {
  boardTitle: string = '';
  boardDescription: string = '';
  boardIcon: string = '';
  private currentBoardId?: number;

  constructor(
    private boardService: BoardService,
    private eventService: EventService
  ) {
    this.setupEventHandlers();
  }

  ngOnInit(): void {
    this.boardService.getLastSelectedBoard().subscribe((board: IBoard) => {
      if (board?.title) this.applyBoard(board);
    });
  }

  private setupEventHandlers() {
    this.eventService.listenForBoardSelectedEvent().subscribe((event) => {
      this.boardService.getBoardById(event.data).subscribe((board: IBoard) => {
        if (board?.title) this.applyBoard(board);
      });
    });

    // Keep the banner in sync when the currently displayed board's
    // name/description/icon is edited from the Configure Boards dialog,
    // without waiting for it to be reselected.
    this.eventService
      .listenForBoardUpdateNameDescriptionRequestEvent()
      .subscribe((event) => {
        if (event.data['id'] === this.currentBoardId) {
          this.boardTitle = event.data['title'];
          this.boardDescription = event.data['description'] || '';
          this.boardIcon = event.data['icon'] || 'dashboard';
        }
      });

    // A deleted board falls back to whichever board becomes current.
    this.eventService.listenForBoardDeletedCompleteEvent().subscribe(() => {
      this.boardService.getLastSelectedBoard().subscribe((board: IBoard) => {
        if (board?.title) {
          this.applyBoard(board);
        } else {
          this.clearBoard();
        }
      });
    });
  }

  private applyBoard(board: IBoard) {
    this.currentBoardId = board.id;
    this.boardTitle = board.title;
    this.boardDescription = board.description || '';
    this.boardIcon = board.icon || 'dashboard';
  }

  private clearBoard() {
    this.currentBoardId = undefined;
    this.boardTitle = '';
    this.boardDescription = '';
    this.boardIcon = '';
  }
}
