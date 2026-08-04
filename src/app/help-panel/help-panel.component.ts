import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { marked } from 'marked';
import { EventService } from '../eventservice/event.service';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

export interface IHelpPanelData {
  title: string;
  helpTopic: string;
}

@Component({
  selector: 'app-help-panel',
  templateUrl: './help-panel.component.html',
  styleUrls: ['./help-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIcon, MatIconButton]
})
export class HelpPanelComponent implements OnInit, OnDestroy {
  gadgetTitle: string = '';
  hasData: boolean = false;
  loading: boolean = false;
  renderedHtml: string = '';
  private destroy$ = new Subject<void>();
  // Guards against a slow-loading fetch for a previous gadget's help topic
  // resolving after the user has already switched to another gadget.
  private requestId = 0;

  constructor(
    private eventService: EventService,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.eventService.listenForOpenHelpPanelEvent()
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        const data: IHelpPanelData = event.data;
        this.loadHelp(data.title, data.helpTopic);
      });

    this.eventService.listenForCloseHelpPanelEvent()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.clearPanel();
      });
  }

  close(): void {
    this.eventService.emitCloseHelpPanelEvent();
  }

  private loadHelp(title: string, helpTopic: string): void {
    const thisRequestId = ++this.requestId;
    this.gadgetTitle = title;
    this.hasData = true;
    this.loading = true;
    this.renderedHtml = '';
    this.changeDetectorRef.detectChanges();

    this.http.get(`assets/help/${helpTopic}.md`, { responseType: 'text' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (markdown) => {
          if (thisRequestId !== this.requestId) return;
          this.renderedHtml = marked.parse(markdown, { async: false }) as string;
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        },
        error: () => {
          if (thisRequestId !== this.requestId) return;
          this.renderedHtml = '';
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  private clearPanel(): void {
    this.requestId++;
    this.gadgetTitle = '';
    this.hasData = false;
    this.loading = false;
    this.renderedHtml = '';
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
