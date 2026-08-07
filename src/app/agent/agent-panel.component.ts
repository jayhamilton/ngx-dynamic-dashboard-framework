import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, map, Observable, of } from 'rxjs';
import { AgentService, AgentResponse, AgentUiPart } from './agent.service';
import { AgentActionService, BoardSummary } from './agent-action.service';
import { IGadget } from '../gadgets/common/gadget-common/gadget-base/gadget.model';

interface ChatPart extends AgentUiPart {
  gadgetPreview?: IGadget;
  gadgetAdded?: boolean;
  boardSummaries?: BoardSummary[];
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content?: string;
  parts?: ChatPart[];
  toolCalls?: Array<{ name: string; arguments: string }>;
}

@Component({
  selector: 'app-agent-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="agent-panel">
      <div class="agent-panel__header">
        <h3>Assistant</h3>
        <span>Conversational dashboard helper</span>
      </div>

      <div class="agent-panel__conversation">
        @if (messages.length === 0) {
          <div class="agent-panel__empty-state">
            <p>Ask the dashboard to create boards, add widgets, or explain the current view.</p>
          </div>
        }

        @for (message of messages; track message.id) {
          <div class="agent-panel__message" [class.agent-panel__message--assistant]="message.role === 'assistant'">
            <div class="agent-panel__message-role">{{ message.role === 'assistant' ? 'Assistant' : 'You' }}</div>
            <div class="agent-panel__message-content">
              @if (message.content) {
                <p>{{ message.content }}</p>
              }

              @if (message.parts?.length) {
                @for (part of message.parts; track part.id) {
                  @if (part.type === 'text') {
                    <p>{{ part.text }}</p>
                  }

                  @if (part.type === 'component' && part.componentType === 'gadget-suggestion') {
                    <div class="agent-panel__component-card">
                      <div class="agent-panel__component-label">Suggested gadget</div>
                      @if (part.gadgetPreview) {
                        <div class="agent-panel__gadget-preview">
                          <mat-icon>{{ part.gadgetPreview.icon }}</mat-icon>
                          <div>
                            <div class="agent-panel__gadget-title">{{ part.gadgetPreview.title }}</div>
                            <div class="agent-panel__gadget-subtitle">{{ part.gadgetPreview.subtitle }}</div>
                          </div>
                        </div>
                        <button
                          mat-stroked-button
                          [disabled]="part.gadgetAdded"
                          (click)="addGadget(part)"
                        >
                          {{ part.gadgetAdded ? 'Added ✓' : 'Add to board' }}
                        </button>
                      } @else {
                        <p>This gadget type isn't in the library.</p>
                      }
                    </div>
                  }

                  @if (part.type === 'component' && part.componentType === 'board-list') {
                    <div class="agent-panel__component-card">
                      <div class="agent-panel__component-label">Your boards</div>
                      @if (part.boardSummaries?.length) {
                        <ul class="agent-panel__board-list">
                          @for (board of part.boardSummaries; track board.id) {
                            <li>
                              <span>{{ board.title }}</span>
                              <button mat-button (click)="switchBoard(board.id)">Switch</button>
                            </li>
                          }
                        </ul>
                      } @else {
                        <p>No boards found yet.</p>
                      }
                    </div>
                  }

                  @if (part.type === 'component' && part.componentType === 'a2ui-card') {
                    <div class="agent-panel__component-card">
                      <div class="agent-panel__component-label">{{ parsedPayload(part)?.title }}</div>
                      <p>{{ parsedPayload(part)?.summary }}</p>
                    </div>
                  }

                  @if (part.type === 'iframe') {
                    <div class="agent-panel__iframe-card">
                      <div class="agent-panel__component-label">{{ part.title }}</div>
                      <iframe [src]="part.src" title="{{ part.title }}"></iframe>
                    </div>
                  }
                }
              }

              @if (message.toolCalls?.length) {
                <div class="agent-panel__tools">
                  <div class="agent-panel__response-title">Tools</div>
                  <ul>
                    @for (tool of message.toolCalls; track tool.name) {
                      <li>{{ tool.name }} → {{ tool.arguments }}</li>
                    }
                  </ul>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <div class="agent-panel__composer">
        <mat-form-field appearance="outline" class="agent-panel__input">
          <mat-label>Ask the dashboard</mat-label>
          <textarea
            matInput
            rows="5"
            [(ngModel)]="prompt"
            (keyup.enter)="send()"
          ></textarea>
        </mat-form-field>

        <button mat-icon-button class="agent-panel__send" (click)="send()" aria-label="Send message">
          <mat-icon>send</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [
    `:host { display: block; height: 100%; padding: 16px; box-sizing: border-box; }`,
    `.agent-panel { display: flex; flex-direction: column; gap: 12px; height: 100%; }`,
    `.agent-panel__header { display: flex; flex-direction: column; gap: 4px; }`,
    `.agent-panel__header h3 { margin: 0; font-size: 1.1rem; }`,
    `.agent-panel__header span { color: var(--app-text-secondary); font-size: 0.9rem; }`,
    `.agent-panel__conversation { flex: 1; display: flex; flex-direction: column; gap: 12px; overflow: auto; padding-right: 4px; }`,
    `.agent-panel__composer { display: flex; flex-direction: column; gap: 8px; }`,
    `.agent-panel__input { width: 100%; }`,
    `.agent-panel__empty-state, .agent-panel__message { border: 1px solid var(--app-border); border-radius: 12px; padding: 12px; background: var(--app-surface); }`,
    `.agent-panel__message--assistant { background: var(--app-brand-tint); border-color: var(--app-brand-tint-strong); }`,
    `.agent-panel__message-role { font-weight: 600; margin-bottom: 6px; }`,
    `.agent-panel__message-content p { margin: 0; white-space: pre-wrap; }`,
    `.agent-panel__response-title { font-weight: 600; margin-bottom: 6px; }`,
    `.agent-panel__tools { margin-top: 8px; }`,
    `.agent-panel__component-card, .agent-panel__iframe-card { margin-top: 8px; border: 1px solid var(--app-border); border-radius: 8px; padding: 10px; background: var(--app-background); }`,
    `.agent-panel__component-label { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--app-text-secondary); margin-bottom: 6px; }`,
    `.agent-panel__gadget-preview { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }`,
    `.agent-panel__gadget-title { font-weight: 600; }`,
    `.agent-panel__gadget-subtitle { color: var(--app-text-secondary); font-size: 0.85rem; }`,
    `.agent-panel__board-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }`,
    `.agent-panel__board-list li { display: flex; align-items: center; justify-content: space-between; gap: 8px; }`,
    `.agent-panel__iframe-card iframe { width: 100%; min-height: 220px; border: 0; border-radius: 8px; background: white; }`,
    `.agent-panel__empty-state p { margin: 0; color: var(--app-text-secondary); }`,
    `.agent-panel__send { width: 44px; height: 44px; min-width: 44px; min-height: 44px; padding: 0; border-radius: 50%; background: var(--app-brand); color: var(--app-brand-contrast); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); align-self: flex-end; display: inline-flex; align-items: center; justify-content: center; line-height: 1; }`,
    `.agent-panel__send:hover { background: var(--app-brand-tint-strong); color: var(--app-brand); }`,
    `.agent-panel__send mat-icon { display: flex; align-items: center; justify-content: center; font-size: 20px; width: 20px; height: 20px; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentPanelComponent {
  prompt = '';
  messages: ChatMessage[] = [];

  constructor(
    private agentService: AgentService,
    private agentActionService: AgentActionService,
    private cdr: ChangeDetectorRef
  ) {}

  send() {
    if (!this.prompt.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: this.prompt.trim()
    };

    this.messages = [...this.messages, userMessage];
    this.prompt = '';

    this.agentService.chat(userMessage.content!).subscribe((response: AgentResponse) => {
      this.resolveParts(response.parts ?? []).subscribe((resolvedParts) => {
        const assistantMessage: ChatMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.message,
          parts: resolvedParts,
          toolCalls: response.toolCalls ?? [],
        };

        this.messages = [...this.messages, assistantMessage];
      });
    });
  }

  addGadget(part: ChatPart) {
    if (!part.gadgetPreview || part.gadgetAdded) return;
    this.agentActionService.addGadgetToBoard(part.gadgetPreview);
    part.gadgetAdded = true;
    this.cdr.markForCheck();
  }

  switchBoard(boardId: number) {
    this.agentActionService.selectBoard(boardId);
  }

  parsedPayload(part: AgentUiPart): { title?: string; summary?: string } | undefined {
    if (typeof part.payload !== 'string') return part.payload as { title?: string; summary?: string } | undefined;
    try {
      return JSON.parse(part.payload);
    } catch {
      return undefined;
    }
  }

  private resolveParts(parts: AgentUiPart[]): Observable<ChatPart[]> {
    if (!parts.length) return of([]);
    return forkJoin(parts.map((part) => this.resolvePart(part)));
  }

  private resolvePart(part: AgentUiPart): Observable<ChatPart> {
    if (part.componentType === 'gadget-suggestion') {
      const payload = this.parsedPayload(part) as { gadgetComponentType?: string } | undefined;
      const gadgetComponentType = payload?.gadgetComponentType;
      if (!gadgetComponentType) return of({ ...part });

      return this.agentActionService.findGadgetDefinition(gadgetComponentType).pipe(
        map((gadgetPreview) => ({ ...part, gadgetPreview, gadgetAdded: false }))
      );
    }

    if (part.componentType === 'board-list') {
      return this.agentActionService
        .getBoardSummaries()
        .pipe(map((boardSummaries) => ({ ...part, boardSummaries })));
    }

    return of({ ...part });
  }
}
