import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AgentService } from './agent.service';

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

                  @if (part.type === 'component') {
                    <div class="agent-panel__component-card">
                      <div class="agent-panel__component-label">{{ part.componentType }}</div>
                      <pre>{{ part.payload | json }}</pre>
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
    `.agent-panel__component-card pre { margin: 0; white-space: pre-wrap; font-size: 0.85rem; }`,
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
  messages: Array<{
    id: number;
    role: 'user' | 'assistant';
    content?: string;
    parts?: Array<{
      id: number;
      type: 'text' | 'component' | 'iframe';
      text?: string;
      componentType?: string;
      payload?: unknown;
      title?: string;
      src?: string;
    }>;
    toolCalls?: Array<{ name: string; arguments: string }>;
  }> = [];

  constructor(private agentService: AgentService) {}

  send() {
    if (!this.prompt.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user' as const,
      content: this.prompt.trim()
    };

    const mockResponse = {
      id: Date.now() + 1,
      role: 'assistant' as const,
      content: '',
      parts: [
        {
          id: 1,
          type: 'text' as const,
          text: `I can help with that. Your request was: "${this.prompt}".`
        },
        {
          id: 2,
          type: 'component' as const,
          componentType: 'a2ui-card',
          payload: { title: 'Dashboard insight', summary: 'This is a mock A2UI component payload.' }
        },
        {
          id: 3,
          type: 'iframe' as const,
          title: 'MCP app preview',
          src: 'https://example.com'
        }
      ],
      toolCalls: [
        { name: 'create_board', arguments: '{"title":"New Board"}' },
        { name: 'add_gadget', arguments: '{"type":"chart"}' }
      ]
    };

    this.messages = [...this.messages, userMessage, mockResponse];
    this.prompt = '';
  }
}
