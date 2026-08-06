import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AgentService } from './agent.service';

@Component({
  selector: 'app-agent-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card style="margin: 16px;">
      <mat-card-header>
        <mat-card-title>Agent Assistant</mat-card-title>
        <mat-card-subtitle>Ask the dashboard to list boards or add gadgets</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div style="display:flex; gap:8px; align-items:center; margin-bottom: 12px;">
          <mat-form-field appearance="outline" style="flex:1;">
            <mat-label>Ask the dashboard</mat-label>
            <input matInput [(ngModel)]="prompt" (keyup.enter)="send()" />
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="send()">Send</button>
        </div>
        <div *ngIf="response" style="white-space: pre-wrap;">
          <strong>Assistant:</strong> {{ response.message }}
          <div *ngIf="response.toolCalls?.length" style="margin-top: 8px;">
            <strong>Tools:</strong>
            <ul>
              <li *ngFor="let tool of response.toolCalls">{{ tool.name }} -> {{ tool.arguments }}</li>
            </ul>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentChatComponent {
  prompt = '';
  response: { message: string; toolCalls: Array<{ name: string; arguments: string }> } | null = null;

  constructor(private agentService: AgentService) {}

  send() {
    if (!this.prompt.trim()) return;
    this.agentService.chat(this.prompt).subscribe((result) => {
      this.response = result;
    });
  }
}
