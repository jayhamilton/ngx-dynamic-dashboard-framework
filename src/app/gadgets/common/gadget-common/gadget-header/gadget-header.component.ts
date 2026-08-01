import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventService } from 'src/app/eventservice/event.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatCardHeader, MatCardAvatar, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { IPropertyPage, ITag } from '../gadget-base/gadget.model';

@Component({
    selector: 'app-gadget-header',
    templateUrl: './gadget-header.component.html',
    styleUrls: ['./gadget-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCardHeader, MatCardAvatar, MatCardTitle, MatCardSubtitle, MatIconButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem]
})
export class GadgetHeaderComponent implements OnInit {
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

  constructor(private eventService: EventService, private dialog: MatDialog) {
    this.title = '';
    this.subtitle = '';
    this.iconpath = '';
    this.inConfig = false;
  }

  ngOnInit(): void {
    if (this.inConfig) {
      this.setMenuLabel();
    }
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
      if (confirmed) this.removeEvent.emit();
    });
  }

  toggleConfigMode() {
    this.setMenuLabel();
    this.toggleConfigModeEvent.emit();
    // Open configuration in side panel
    this.eventService.emitOpenConfigPanelEvent({
      data: {
        title: this.title,
        instanceId: this.gadgetInstanceId,
        propertyPages: this.gadgetPropertyPages,
        tags: this.gadgetTags,
        propertyChangeCallback: this.propertyChangeCallback
      }
    });
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
