import { inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { IGadget } from '../gadgets/common/gadget-common/gadget-base/gadget.model';
import { IBoard, IRow } from './board.model';
import { LocalStorageBoardRepository } from './local-storage-board.repository';

/**
 * Defaults to LocalStorageBoardRepository so every existing test and the
 * app itself keep working with no provider wiring required. app.config.ts
 * still registers it explicitly as the one line to change for a REST
 * backend later — this default is what makes that swap optional rather
 * than mandatory everywhere BoardService is constructed.
 */
export const BOARD_REPOSITORY = new InjectionToken<IBoardRepository>('BOARD_REPOSITORY', {
  providedIn: 'root',
  factory: () => inject(LocalStorageBoardRepository),
});

/**
 * Persistence boundary for board data. BoardService owns domain logic
 * (which column a new gadget lands in, instanceId generation, tabs/
 * relationship bookkeeping) and is the only thing components talk to;
 * everything below this interface is just "where the bytes live."
 *
 * Every method is scoped to the resource it actually changes rather than
 * the whole board collection. That costs nothing against localStorage —
 * it's still one blob under the hood for LocalStorageBoardRepository —
 * but it's the difference between a REST implementation later doing
 * `PATCH /boards/:id` for a title edit versus `PUT /boards` with every
 * board, every row, and every gadget on the account, and it's what
 * keeps two people editing at once from silently overwriting each
 * other's unrelated changes.
 */
export interface IBoardRepository {
  getBoards(): Observable<IBoard[]>;

  getBoard(boardId: number): Observable<IBoard | undefined>;

  getLastSelectedBoardId(): Observable<number>;

  setLastSelectedBoardId(boardId: number): Observable<void>;

  /**
   * Creates a board. `pairWithExistingBoardId`, when given, additionally
   * pairs it with an existing board as tabs of one another: the new
   * board becomes the tab-group parent, the existing board becomes its
   * child. Still a two-record write (the new board plus the existing
   * one's tabs/relationship), never the full collection.
   */
  createBoard(board: IBoard, pairWithExistingBoardId?: number): Observable<IBoard>;

  updateBoardMeta(
    boardId: number,
    meta: { title: string; description: string; icon: string }
  ): Observable<void>;

  /**
   * Removes a board and detaches it from any parent/child tab
   * relationship. Returns the ids of boards whose `tabs`/`relationship`
   * changed as a result, so callers relying on stale in-memory copies
   * know what else to refresh.
   */
  deleteBoard(boardId: number): Observable<{ affectedBoardIds: number[] }>;

  /**
   * Layout edits and drag-and-drop both boil down to "this board's rows
   * are now this." A board-sized write, not a collection-sized one.
   */
  replaceBoardRows(boardId: number, rows: IRow[], structure?: string): Observable<void>;

  /**
   * Persists a new gadget instance into a specific board/row/column.
   * The repository (not the caller) assigns instanceId, since a REST
   * backend would want to be the source of truth for ids instead of
   * trusting a client-generated Date.now().
   */
  addGadget(
    boardId: number,
    rowIndex: number,
    columnIndex: number,
    gadgetTemplate: IGadget
  ): Observable<IGadget>;

  /**
   * Gadget instanceIds are already globally unique in this model, so
   * these two don't need a boardId — which also means no component
   * needs to start threading its parent board's id through just to
   * satisfy the repository, only the storage layer underneath changes.
   */
  removeGadget(instanceId: number): Observable<void>;

  updateGadgetProperties(instanceId: number, propertiesJSON: string): Observable<void>;
}
