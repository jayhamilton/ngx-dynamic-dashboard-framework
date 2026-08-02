import { Component, ElementRef, EventEmitter, Input, OnInit, OnDestroy, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventService } from 'src/app/eventservice/event.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatCardHeader, MatCardAvatar, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { IPropertyPage, ITag } from '../gadget-base/gadget.model';
import { AnimationService } from 'src/app/animation/animation.service';

@Component({
    selector: 'app-gadget-header',
    templateUrl: './gadget-header.component.html',
    styleUrls: ['./gadget-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCardHeader, MatCardAvatar, MatCardTitle, MatCardSubtitle, MatIconButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem]
})
export class GadgetHeaderComponent implements OnInit, OnDestroy {
  @Output() removeEvent: EventEmitter<any> = new EventEmitter();
  @Output() toggleConfigModeEvent: EventEmitter<any> = new EventEmitter();
  @Input() title: string;
  @Input() subtitle: string;
  @Input() iconpath: string;
  @Input() inConfig: boolean;
  @Input() gadgetInstanceId: number = -1;
  @Input() gadgetPropertyPages: IPropertyPage[] = [];
  @Input() gadgetTags: ITag[] = [];
  @Input() propertyChangeCallback: ((propertiesJSON: string) => void) | null = null;
  menuLabel = 'Configure';
  private destroy$ = new Subject<void>();

  constructor(
    private eventService: EventService,
    private dialog: MatDialog,
    private elementRef: ElementRef<HTMLElement>,
    private animationService: AnimationService
  ) {
    this.title = '';
    this.subtitle = '';
    this.iconpath = '';
    this.inConfig = false;
  }

  ngOnInit(): void {
    if (this.inConfig) {
      this.setMenuLabel();
    }

    // The panel can close for reasons other than this gadget's own menu
    // (its close button, backdrop click, escape key, or opening another
    // side panel) — this is the single place that keeps inConfig in sync
    // with the panel actually being closed. Guarded by inConfig so this
    // doesn't double-toggle when the gadget itself just triggered the close.
    this.eventService.listenForConfigPanelClosedEvent()
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (this.inConfig && event.data.instanceId === this.gadgetInstanceId) {
          this.setMenuLabel();
          this.toggleConfigModeEvent.emit();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Gadgets already placed on a board before the icon field switched from an
  // image path to a Material icon ligature name still have the old path
  // persisted in their saved instance data (board config doesn't re-read
  // library.json once placed). Rendering a path string as a <mat-icon>
  // ligature shows nothing usable, so fall back to a generic icon for
  // anything that doesn't look like a plain ligature name.
  get displayIcon(): string {
    if (!this.iconpath || /[\/.]/.test(this.iconpath)) {
      return 'widgets';
    }
    return this.iconpath;
  }

  remove() {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        title: 'Remove Gadget',
        message: `Remove "${this.title}" from the dashboard?`,
        confirmLabel: 'Remove',
      }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      // Every gadget renders its header inside its own mat-card, so this is
      // the one place that can fade the whole card out for all gadget types
      // without touching each gadget component. Emit once the card is gone
      // so the board doesn't re-render out from under the animation.
      const card = this.elementRef.nativeElement.closest('mat-card') as HTMLElement | null;
      if (!card) {
        this.removeEvent.emit();
        return;
      }
      this.animationService.gadgetLeave(card).then(() => this.removeEvent.emit());
    });
  }

  toggleConfigMode() {
    this.setMenuLabel();
    this.toggleConfigModeEvent.emit();
    if (this.menuLabel === 'Exit Configuration') {
      // Just entered config mode — open the side panel.
      this.eventService.emitOpenConfigPanelEvent({
        data: {
          title: this.title,
          instanceId: this.gadgetInstanceId,
          propertyPages: this.gadgetPropertyPages,
          tags: this.gadgetTags,
          propertyChangeCallback: this.propertyChangeCallback
        }
      });
    } else {
      // Just exited config mode via this gadget's own menu — close it.
      this.eventService.emitCloseConfigPanelEvent();
    }
  }

  setMenuLabel() {
    if (this.menuLabel === 'Configure') {
      this.menuLabel = 'Exit Configuration';
    } else {
      this.menuLabel = 'Configure';
      this.eventService.emitBoardGadgetPropertyChangeEvent();
    }
  }
}
