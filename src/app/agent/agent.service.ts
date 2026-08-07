import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { BoardService } from '../board/board.service';

export interface AgentRequest {
  message: string;
  boardContext?: {
    boardId?: number;
    boardTitle?: string;
    activeTab?: string;
  };
}

export interface ToolCall {
  name: string;
  arguments: string;
}

export interface AgentUiPart {
  id: number;
  type: 'text' | 'component' | 'iframe';
  text?: string;
  componentType?: string;
  payload?: unknown;
  title?: string;
  src?: string;
}

export interface AgentResponse {
  message: string;
  toolCalls: ToolCall[];
  parts?: AgentUiPart[];
}

@Injectable({ providedIn: 'root' })
export class AgentService {
  constructor(
    private http: HttpClient,
    private boardService: BoardService
  ) {}

  chat(message: string): Observable<AgentResponse> {
    return this.boardService.getLastSelectedBoard().pipe(
      switchMap((board) => {
        const request: AgentRequest = {
          message,
          boardContext: {
            boardId: board?.id,
            boardTitle: board?.title,
            activeTab: undefined,
          },
        };

        return this.http.post<AgentResponse>(`${environment.apihost}/api/agent/chat`, request);
      })
    );
  }
}
