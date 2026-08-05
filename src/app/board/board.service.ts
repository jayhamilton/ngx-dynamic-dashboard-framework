import { Inject, Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IEvent, EventService } from '../eventservice/event.service';
import { IGadget } from '../gadgets/common/gadget-common/gadget-base/gadget.model';
import { LayoutType } from '../layout/layout.model';
import { BOARD_REPOSITORY, IBoardRepository } from './board-repository.model';
import { BoardType, Hiearchy, IBoard, IBoardCollection } from './board.model';

/**
 * Board domain logic: which column a new gadget lands in, the default
 * board template, and the fallback-to-first-board behavior when nothing
 * is selected yet. Everything that's actually "where the data lives"
 * lives behind IBoardRepository instead, so this class doesn't change
 * when that storage does.
 */
@Injectable({
  providedIn: 'root',
})
export class BoardService {
  emptyBoardCollectionObject: IBoard;

  constructor(
    private eventService: EventService,
    @Inject(BOARD_REPOSITORY) private repo: IBoardRepository
  ) {
    this.emptyBoardCollectionObject = {
      title: '',
      description: '',
      structure: '',
      id: BoardType.EMPTYBOARDCOLLECTION,
      relationship: Hiearchy.PARENT,
      tabs: [],
      rows: [],
      icon: 'dashboard',
    };

    this.setupEventListeners();
  }

  public getBoardCollection(): Observable<IBoardCollection> {
    return combineLatest([this.repo.getBoards(), this.repo.getLastSelectedBoardId()]).pipe(
      map(([boardList, lastSelectedBoard]) => ({ lastSelectedBoard, boardList }))
    );
  }

  public getLastSelectedBoard(): Observable<IBoard> {
    return this.repo.getBoards().pipe(
      switchMap((boards) => {
        if (boards.length === 0) return of(this.emptyBoardCollectionObject);
        return this.repo
          .getLastSelectedBoardId()
          .pipe(map((lastId) => boards.find((b) => b.id === lastId) ?? boards[0]));
      })
    );
  }

  public getBoardById(boardId: number): Observable<IBoard> {
    return this.repo.getBoards().pipe(
      switchMap((boards) => {
        if (boards.length === 0) return of(this.emptyBoardCollectionObject);

        const found = boards.find((b) => b.id === boardId);
        if (!found) return of(boards[0]);

        // Fetching a board by id is how the UI expresses "the user is
        // looking at this board now" — persist it as last-selected so a
        // reload comes back here.
        return this.repo.setLastSelectedBoardId(boardId).pipe(map(() => found));
      })
    );
  }

  /**
   * Places a new gadget instance in row 0's least-full column, so gadgets
   * keep balancing across every column rather than just filling each one
   * once and then always landing back in column 0 (findIndex-for-empty
   * only ever matches during that first pass).
   */
  public saveNewGadgetToBoard(incomingBoard: IBoard, incomingGadget: IGadget): void {
    this.repo.getBoard(incomingBoard.id).subscribe((board) => {
      if (!board) return;

      const columns = board.rows[0].columns;
      let columnIndex = 0;
      let fewestGadgets = Infinity;
      columns.forEach((column, index) => {
        if (column.gadgets.length < fewestGadgets) {
          fewestGadgets = column.gadgets.length;
          columnIndex = index;
        }
      });

      this.repo.addGadget(board.id, 0, columnIndex, incomingGadget).subscribe();
    });
  }

  public updateBoardDueToLayoutChange(incomingBoard: IBoard): void {
    this.repo
      .replaceBoardRows(incomingBoard.id, incomingBoard.rows, incomingBoard.structure)
      .subscribe();
  }

  public updateBoardDueToDragAndDrop(incomingBoard: IBoard): void {
    this.repo.replaceBoardRows(incomingBoard.id, incomingBoard.rows).subscribe();
  }

  public updateBoardDueToWidthChange(incomingBoard: IBoard): void {
    this.repo
      .updateBoardContentWidth(incomingBoard.id, incomingBoard.contentWidth ?? 'normal')
      .subscribe();
  }

  public savePropertyPageConfigurationToDestination(
    gadgetPropertiesAsJSON: string,
    instanceId: number
  ): void {
    this.repo.updateGadgetProperties(instanceId, gadgetPropertiesAsJSON).subscribe();
  }

  /**
   * Event Listners
   */
  private setupEventListeners() {
    this.eventService
      .listenForBoardCreateRequestEvent()
      .subscribe((event: IEvent) => {
        this.createNewBoard(event);
      });

    this.eventService
      .listenForBoardUpdateNameDescriptionRequestEvent()
      .subscribe((event: IEvent) => {
        this.updateBoard(event);
      });

    this.eventService
      .listenForBoardDeleteRequestEvent()
      .subscribe((event: IEvent) => {
        this.deleteBoard(event);
      });

    this.eventService
      .listenForGadgetDeleteEvent()
      .subscribe((event: IEvent) => {
        this.deleteGadgetFromBoard(event);
      });
  }

  private getAllDefaultBoards(): IBoard[] {
    return [
      {
        title: 'Board',
        description: '',
        structure: LayoutType.TWO_COL_EQUAL,
        id: BoardType.DEFAULT,
        tabs: [{ title: 'Board', id: BoardType.DEFAULT }],
        relationship: Hiearchy.PARENT,
        icon: 'dashboard',
        rows: [
          {
            columns: [
              {
                gadgets: [],
              },
              {
                gadgets: [],
              },
            ],
          },
        ],
      },
    ];
  }

  private getDefaultBoard(type: number): IBoard {
    let defaultBoardsArray = this.getAllDefaultBoards();
    return defaultBoardsArray[type]; //currently only one default board type which is 0 exists
  }

  private createNewBoard(event: IEvent): void {
    let newBoard = this.getDefaultBoard(0); //currently only one default board type

    newBoard.id = Date.now();
    newBoard.title = event.data['title'];
    newBoard.description = event.data['description'];
    newBoard.relationship = Hiearchy.PARENT;
    newBoard.icon = event.data['icon'] || 'dashboard';

    const pairWithExistingBoardId: number | undefined = event.data['tabvalue'] ?? undefined;

    this.repo.createBoard(newBoard, pairWithExistingBoardId).subscribe((createdBoard) => {
      this.eventService.emitBoardCreatedCompleteEvent({ data: createdBoard });
    });
  }

  private updateBoard(event: IEvent): void {
    this.repo
      .updateBoardMeta(event.data['id'], {
        title: event.data['title'],
        description: event.data['description'],
        icon: event.data['icon'],
      })
      .subscribe();
  }

  private deleteBoard(event: IEvent): void {
    this.repo.deleteBoard(event.data['id']).subscribe(() => {
      this.eventService.emitBoardDeletedCompleteEvent({ data: event });
    });
  }

  private deleteGadgetFromBoard(eventDataGadgetInstanceId: IEvent): void {
    this.repo.removeGadget(eventDataGadgetInstanceId.data).subscribe();
  }
}
