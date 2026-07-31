import { Component, forwardRef, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EventService } from '../../eventservice/event.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'json-forms-editor',
  template: `
    <div class="simple-forms-container">
      @for (series of seriesData; track series; let i = $index) {
        <div class="series-form">
          <mat-card style="margin: 10px 0; padding: 16px;">
            <mat-card-header>
              <mat-card-title>Series {{ i + 1 }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-form-field appearance="fill" style="width: 100%; margin-bottom: 16px;">
                <mat-label>Series Name</mat-label>
                <input matInput [(ngModel)]="series.name" (ngModelChange)="onDataChange()" (input)="onDataChange()" (blur)="onTouch()">
              </mat-form-field>
              @for (point of series.series; track point; let j = $index) {
                <div class="data-point" style="display: flex; gap: 16px; margin-bottom: 8px;">
                  <mat-form-field appearance="fill" style="flex: 1;">
                    <mat-label>Label</mat-label>
                    <input matInput [(ngModel)]="point.name" (ngModelChange)="onDataChange()" (input)="onDataChange()" (blur)="onTouch()">
                  </mat-form-field>
                  <mat-form-field appearance="fill" style="flex: 1;">
                    <mat-label>Value</mat-label>
                    <input matInput type="number" [(ngModel)]="point.value" (ngModelChange)="onDataChange()" (input)="onDataChange()" (blur)="onTouch()">
                  </mat-form-field>
                  <button mat-icon-button color="warn" (click)="removeDataPoint(i, j)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              }
              <div style="margin-top: 16px;">
                <button mat-raised-button color="primary" (click)="addDataPoint(i)">
                  <mat-icon>add</mat-icon> Add Data Point
                </button>
                <button mat-raised-button color="warn" (click)="removeSeries(i)" style="margin-left: 8px;">
                  <mat-icon>delete</mat-icon> Remove Series
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      }
    
      <div style="margin-top: 16px;">
        <button mat-raised-button color="accent" (click)="addSeries()">
          <mat-icon>add</mat-icon> Add New Series
        </button>
      </div>
    </div>
    `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JsonFormsEditorComponent),
      multi: true,
    }
  ],
  standalone: false
})
export class JsonFormsEditorComponent implements OnInit, OnDestroy, ControlValueAccessor {
  seriesData: any[] = [];
  
  private onChange = (value: any) => {};
  private onTouched = () => {};
  private destroy$ = new Subject<void>();
  private instanceId = Math.random().toString(36).substr(2, 9);

  constructor(private eventService: EventService, private cdr: ChangeDetectorRef) {
    console.log('JsonFormsEditor: Created instance', this.instanceId);
  }

  ngOnInit() {
    // Initialize with default data if empty
    if (!this.seriesData || this.seriesData.length === 0) {
      this.seriesData = this.getDefaultData();
    }

    // Listen for chart data changes from other tabs
    this.eventService.listenForChartDataChangedEvent()
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        console.log(`JsonFormsEditor[${this.instanceId}]: Received event:`, event);
        if (event.data && event.data.source !== 'json-forms' && event.data.sourceInstance !== this.instanceId) {
          console.log(`JsonFormsEditor[${this.instanceId}]: Processing chart data change from:`, event.data.source, 'sourceInstance:', event.data.sourceInstance);
          this.updateFromExternalSource(event.data.chartData);
        } else {
          console.log(`JsonFormsEditor[${this.instanceId}]: Ignoring event - source:`, event.data?.source, 'sourceInstance:', event.data?.sourceInstance);
        }
      });
  }

  private getDefaultData() {
    return [
      {
        name: "Series 1",
        series: [
          { name: "Monday", value: 320 },
          { name: "Tuesday", value: 730 },
          { name: "Wednesday", value: 294 }
        ]
      },
      {
        name: "Series 2",
        series: [
          { name: "Monday", value: 480 },
          { name: "Tuesday", value: 300 },
          { name: "Wednesday", value: 180 }
        ]
      }
    ];
  }

  onDataChange() {
    const jsonData = JSON.stringify(this.seriesData, null, 2);
    console.log(`JsonFormsEditor[${this.instanceId}]: Data changed, emitting:`, jsonData);
    this.onChange(jsonData);
    
    // Emit event for other tabs to listen
    this.eventService.emitChartDataChanged({
      data: {
        source: 'json-forms',
        chartData: jsonData,
        sourceInstance: this.instanceId
      }
    });
  }

  onTouch() {
    this.onTouched();
  }

  getCurrentJson(): string {
    return JSON.stringify(this.seriesData, null, 2);
  }

  private updateFromExternalSource(jsonData: string) {
    try {
      console.log(`JsonFormsEditor[${this.instanceId}]: Updating from external source:`, jsonData);
      this.seriesData = JSON.parse(jsonData);
      this.cdr.detectChanges();
      this.cdr.markForCheck();
      console.log(`JsonFormsEditor[${this.instanceId}]: Change detection triggered`);
    } catch (error) {
      console.error(`JsonFormsEditor[${this.instanceId}]: Failed to parse external JSON:`, error);
    }
  }

  addSeries() {
    this.seriesData.push({
      name: `Series ${this.seriesData.length + 1}`,
      series: [
        { name: "Monday", value: 0 },
        { name: "Tuesday", value: 0 },
        { name: "Wednesday", value: 0 }
      ]
    });
    this.onDataChange();
  }

  removeSeries(index: number) {
    this.seriesData.splice(index, 1);
    this.onDataChange();
  }

  addDataPoint(seriesIndex: number) {
    this.seriesData[seriesIndex].series.push({
      name: "New Point",
      value: 0
    });
    this.onDataChange();
  }

  removeDataPoint(seriesIndex: number, pointIndex: number) {
    this.seriesData[seriesIndex].series.splice(pointIndex, 1);
    this.onDataChange();
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    console.log(`JsonFormsEditor[${this.instanceId}]: writeValue called with:`, value);
    try {
      this.seriesData = value ? JSON.parse(value) : this.getDefaultData();
      console.log(`JsonFormsEditor[${this.instanceId}]: seriesData set to:`, this.seriesData);
    } catch (error) {
      console.error(`JsonFormsEditor[${this.instanceId}]: Invalid JSON:`, error);
      this.seriesData = this.getDefaultData();
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // TODO: Implement if needed
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}