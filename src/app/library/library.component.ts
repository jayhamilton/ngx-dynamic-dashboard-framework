import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EventService } from '../eventservice/event.service';
import { IGadget } from '../gadgets/common/gadget-common/gadget-base/gadget.model';
import { LibraryService } from './library.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit, AfterViewInit {
  @ViewChild('dialog', { read: ElementRef })
  libraryDialogCloseButton?: ElementRef;

  constructor(
    private libraryService: LibraryService,
    private eventService: EventService
  ) {}
  ngAfterViewInit(): void {
    console.log(this.libraryDialogCloseButton);
  }

  library!: IGadget[];
  ngOnInit(): void {
    this.getLibrary();
  }

  getLibrary() {
    this.libraryService.getLibrary().subscribe((libraryData) => {
      this.library = libraryData;
    });
  }

  addGadget(gadgetData: IGadget) {

    console.log("---> adding gadget");
    console.log(gadgetData);
    this.eventService.emitLibraryAddGadgetEvent({ data: gadgetData });
    this.libraryDialogCloseButton?.nativeElement.click();
  }
}
