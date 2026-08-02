import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IGadget, IPropertyPage } from '../gadgets/common/gadget-common/gadget-base/gadget.model';
import { IBoardRepository } from './board-repository.model';
import { Hiearchy, IBoard, IBoardCollection, IRow, ITab } from './board.model';

/**
 * Today's storage: one `boardCollection` blob in localStorage. The
 * interface above it is already resource-scoped so a future
 * RestBoardRepository can implement the same contract against real
 * endpoints without BoardService or any component changing — this
 * class is the only thing that knows the storage is actually one blob.
 */
@Injectable({ providedIn: 'root' })
export class LocalStorageBoardRepository implements IBoardRepository {
  private readonly STORAGE_KEY = 'boardCollection';

  getBoards(): Observable<IBoard[]> {
    return of(this.read().boardList);
  }

  getBoard(boardId: number): Observable<IBoard | undefined> {
    return of(this.read().boardList.find((board) => board.id === boardId));
  }

  getLastSelectedBoardId(): Observable<number> {
    return of(this.read().lastSelectedBoard);
  }

  setLastSelectedBoardId(boardId: number): Observable<void> {
    return of(
      this.mutate((collection) => {
        collection.lastSelectedBoard = boardId;
      })
    );
  }

  createBoard(board: IBoard, pairWithExistingBoardId?: number): Observable<IBoard> {
    return of(
      this.mutate((collection) => {
        const tabs: ITab[] = [{ title: board.title, id: board.id }];

        if (pairWithExistingBoardId != null) {
          const existingBoard = collection.boardList.find(
            (b) => b.id === pairWithExistingBoardId
          );
          if (existingBoard) {
            tabs.push({ title: existingBoard.title, id: existingBoard.id });
            existingBoard.relationship = Hiearchy.CHILD;
            existingBoard.tabs = tabs;
          }
        }

        board.tabs = tabs;
        collection.boardList = [...collection.boardList, board];
        collection.lastSelectedBoard = board.id;
      }, board)
    );
  }

  updateBoardMeta(
    boardId: number,
    meta: { title: string; description: string; icon: string }
  ): Observable<void> {
    return of(
      this.mutate((collection) => {
        const board = collection.boardList.find((b) => b.id === boardId);
        if (!board) return;
        board.title = meta.title;
        board.description = meta.description;
        board.icon = meta.icon || board.icon || 'dashboard';
      })
    );
  }

  deleteBoard(boardId: number): Observable<{ affectedBoardIds: number[] }> {
    return of(
      this.mutate((collection) => {
        const idx = collection.boardList.findIndex((board) => board.id === boardId);
        if (idx >= 0) collection.boardList.splice(idx, 1);

        if (collection.lastSelectedBoard === boardId) {
          collection.lastSelectedBoard = collection.boardList.reduce(
            (mostRecent, board) => Math.max(mostRecent, board.id),
            0
          );
        }

        const affectedBoardIds: number[] = [];
        collection.boardList.forEach((board) => {
          const tabIdx = board.tabs.findIndex((tab) => tab.id === boardId);
          if (tabIdx >= 0) {
            board.tabs.splice(tabIdx, 1);
            board.relationship = Hiearchy.PARENT;
            affectedBoardIds.push(board.id);
          }
        });

        return { affectedBoardIds };
      })
    );
  }

  replaceBoardRows(boardId: number, rows: IRow[], structure?: string): Observable<void> {
    return of(
      this.mutate((collection) => {
        const board = collection.boardList.find((b) => b.id === boardId);
        if (!board) return;
        board.rows = [...rows];
        if (structure != null) board.structure = structure;
      })
    );
  }

  addGadget(
    boardId: number,
    rowIndex: number,
    columnIndex: number,
    gadgetTemplate: IGadget
  ): Observable<IGadget> {
    return of(
      this.mutate((collection) => {
        const instance: IGadget = JSON.parse(JSON.stringify(gadgetTemplate));
        instance.instanceId = this.nextInstanceId(collection);

        const board = collection.boardList.find((b) => b.id === boardId);
        const column = board?.rows[rowIndex]?.columns[columnIndex];
        if (!column) {
          throw new Error(
            `addGadget: board ${boardId} has no row ${rowIndex}/column ${columnIndex}`
          );
        }
        column.gadgets = [...column.gadgets, instance];

        return instance;
      })
    );
  }

  removeGadget(instanceId: number): Observable<void> {
    return of(
      this.mutate((collection) => {
        collection.boardList.forEach((board) => {
          board.rows.forEach((row) => {
            row.columns.forEach((column) => {
              const idx = column.gadgets.findIndex((g) => g.instanceId === instanceId);
              if (idx >= 0) column.gadgets.splice(idx, 1);
            });
          });
        });
      })
    );
  }

  updateGadgetProperties(instanceId: number, propertiesJSON: string): Observable<void> {
    return of(
      this.mutate((collection) => {
        collection.boardList.forEach((board) => {
          board.rows.forEach((row) => {
            row.columns.forEach((column) => {
              const gadget = column.gadgets.find((g) => g.instanceId === instanceId);
              if (gadget) this.applyProperties(propertiesJSON, gadget);
            });
          });
        });
      })
    );
  }

  /**
   * Date.now() alone can repeat when two gadgets are added inside the
   * same millisecond, and duplicate ids would make configuring one
   * instance write to both. Step past anything already in use.
   */
  private nextInstanceId(collection: IBoardCollection): number {
    const used = new Set<number>();
    collection.boardList.forEach((board) => {
      board.rows.forEach((row) => {
        row.columns.forEach((column) => {
          column.gadgets.forEach((gadget) => used.add(gadget.instanceId));
        });
      });
    });

    let candidate = Date.now();
    while (used.has(candidate)) candidate++;
    return candidate;
  }

  private applyProperties(propertiesJSON: string, gadget: IGadget): void {
    const updatedPropsObject = JSON.parse(propertiesJSON);

    gadget.propertyPages.forEach((propertyPage: IPropertyPage) => {
      propertyPage.properties.forEach((property) => {
        if (!updatedPropsObject.hasOwnProperty(property.key)) return;
        property.value = updatedPropsObject[property.key];

        if (property.key === 'title') gadget.title = updatedPropsObject['title'];
        if (property.key === 'subtitle') gadget.subtitle = updatedPropsObject['subtitle'];
      });
    });
  }

  private read(): IBoardCollection {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw == null ? { lastSelectedBoard: -1, boardList: [] } : JSON.parse(raw);
  }

  private write(collection: IBoardCollection): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collection));
  }

  /** Read-modify-write against the one localStorage blob, returning whatever `fn` returns. */
  private mutate<T>(fn: (collection: IBoardCollection) => T | void, fallback?: T): T {
    const collection = this.read();
    const result = fn(collection);
    this.write(collection);
    return (result ?? fallback) as T;
  }
}
