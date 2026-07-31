import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="confirm-title">
      <mat-icon class="warn-icon">warning</mat-icon>
      {{ data.title }}
    </h2>
    <mat-dialog-content>
      <p class="confirm-message">{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button [mat-dialog-close]="false">
        {{ data.cancelLabel || 'Cancel' }}
      </button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">
        {{ data.confirmLabel || 'Delete' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
      padding: 8px 4px;
    }
    .confirm-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.1rem;
      font-weight: 500;
      color: #333;
      padding: 8px 24px 16px;
      border-bottom: 1px solid #e0e0e0;
      margin: 0;
    }
    .warn-icon {
      color: #f44336;
      font-size: 24px;
      height: 24px;
      width: 24px;
    }
    mat-dialog-content {
      padding: 20px 24px 16px !important;
    }
    .confirm-message {
      margin: 0;
      color: #555;
      font-size: 0.95rem;
      line-height: 1.5;
    }
    mat-dialog-actions {
      gap: 10px;
      padding: 12px 24px 16px !important;
      border-top: 1px solid #e0e0e0;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {}
}
