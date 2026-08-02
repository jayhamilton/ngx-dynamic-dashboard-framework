import {
  Component,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { EventService } from '../eventservice/event.service';
import { IGadget } from '../gadgets/common/gadget-common/gadget-base/gadget.model';
import { LibraryService } from './library.service';
import { CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf } from '@angular/cdk/scrolling';
import { MatCard, MatCardHeader, MatCardAvatar, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { NgStyle } from '@angular/common';
import { MatMiniFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    styleUrls: ['./library.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf, MatCard, NgStyle, MatCardHeader, MatCardAvatar, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, MatMiniFabButton, MatIcon, MatIconButton]
})
export class LibraryComponent implements OnInit {
  colors = [
    '#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD', '#E74C3C',
    '#3498DB', '#2ECC71', '#1ABC9C', '#9B59B6', '#34495E', '#16A085',
    '#F39C12', '#D35400', '#C0392B', '#7F8C8D', '#BDC3C7', '#95A5A6',
    '#2980B9', '#27AE60', '#8E44AD', '#2C3E50', '#F4D03F', '#E67E22',
    '#D35400', '#1ABC9C', '#2ECC71', '#E74C3C', '#9B59B6', '#34495E'
  ];

  constructor(
    private libraryService: LibraryService,
    private eventService: EventService
  ) {}

  library!: IGadget[];
  ngOnInit(): void {
    this.getLibrary();
  }

  getLibrary() {
    this.libraryService.getLibrary().subscribe((libraryData) => {
      this.library = libraryData;
    });
  }

  private lastAddTime = 0;

  addGadget(gadgetData: IGadget) {
    const now = Date.now();
    if (now - this.lastAddTime < 1000) return;
    this.lastAddTime = now;
    this.eventService.emitLibraryAddGadgetEvent({ data: gadgetData });
  }

  close() {
    this.eventService.emitCloseLibraryPanelEvent();
  }
}
