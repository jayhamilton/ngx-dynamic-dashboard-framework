import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EventService } from '../eventservice/event.service';
import { BoardService } from '../board/board.service';
import { LibraryService } from '../library/library.service';
import { IGadget } from '../gadgets/common/gadget-common/gadget-base/gadget.model';

export interface BoardSummary {
  id: number;
  title: string;
}

/**
 * Turns an assistant tool-call intent into a real app mutation by reusing
 * the same EventService/BoardService/LibraryService paths the Library and
 * Sidenav panels already use, so gadget placement and board switching stay
 * identical whether triggered from the UI or from chat.
 */
@Injectable({ providedIn: 'root' })
export class AgentActionService {
  constructor(
    private eventService: EventService,
    private boardService: BoardService,
    private libraryService: LibraryService
  ) {}

  findGadgetDefinition(gadgetComponentType: string): Observable<IGadget | undefined> {
    return this.libraryService
      .getLibrary()
      .pipe(map((library) => library.find((gadget) => gadget.componentType === gadgetComponentType)));
  }

  addGadgetToBoard(gadget: IGadget): void {
    this.eventService.emitLibraryAddGadgetEvent({ data: gadget });
  }

  getBoardSummaries(): Observable<BoardSummary[]> {
    return this.boardService
      .getBoardCollection()
      .pipe(map((collection) => collection.boardList.map((board) => ({ id: board.id, title: board.title }))));
  }

  selectBoard(boardId: number): void {
    this.eventService.emitBoardSelectedEvent({ data: boardId });
  }
}
