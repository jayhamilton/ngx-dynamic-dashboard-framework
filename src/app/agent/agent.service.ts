import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AgentRequest {
  message: string;
}

export interface ToolCall {
  name: string;
  arguments: string;
}

export interface AgentResponse {
  message: string;
  toolCalls: ToolCall[];
}

@Injectable({ providedIn: 'root' })
export class AgentService {
  constructor(private http: HttpClient) {}

  chat(message: string): Observable<AgentResponse> {
    return this.http.post<AgentResponse>(`${environment.apihost}/api/agent/chat`, { message });
  }
}
