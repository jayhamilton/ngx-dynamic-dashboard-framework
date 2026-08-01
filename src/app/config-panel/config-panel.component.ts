import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventService } from '../eventservice/event.service';
import { IPropertyPage, ITag } from '../gadgets/common/gadget-common/gadget-base/gadget.model';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

export interface IConfigPanelData {
  title: string;
  instanceId: number;
  propertyPages: IPropertyPage[];
  tags: ITag[];
  propertyChangeCallback: (propertiesJSON: string) => void;
}

@Component({
  selector: 'app-config-panel',
  templateUrl: './config-panel.component.html',
  styleUrls: ['./config-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DynamicFormComponent, MatIcon, MatIconButton]
})
export class ConfigPanelComponent implements OnInit, OnDestroy {
  gadgetTitle: string = '';
  instanceId: number = -1;
  propertyPages: IPropertyPage[] = [];
  tags: ITag[] = [];
  hasData: boolean = false;
  private propertyChangeCallback: ((propertiesJSON: string) => void) | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private eventService: EventService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.eventService.listenForOpenConfigPanelEvent()
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        const data: IConfigPanelData = event.data;
        this.gadgetTitle = data.title;
        this.instanceId = data.instanceId;
        this.propertyPages = data.propertyPages;
        this.tags = data.tags;
        this.propertyChangeCallback = data.propertyChangeCallback;
        this.hasData = true;
        this.changeDetectorRef.detectChanges();
      });

    this.eventService.listenForCloseConfigPanelEvent()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.clearPanel();
      });
  }

  onPropertyChange(propertiesJSON: string): void {
    if (this.propertyChangeCallback) {
      this.propertyChangeCallback(propertiesJSON);
    }
  }

  close(): void {
    this.eventService.emitCloseConfigPanelEvent();
    this.eventService.emitBoardGadgetPropertyChangeEvent();
  }

  private clearPanel(): void {
    this.gadgetTitle = '';
    this.instanceId = -1;
    this.propertyPages = [];
    this.tags = [];
    this.hasData = false;
    this.propertyChangeCallback = null;
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
