import { Component, OnInit } from '@angular/core';
import { EventService } from '../eventservice/event.service';
import { IGadget } from '../gadgets/gadget.model';
import { LibraryService } from './library.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  constructor(private libraryService: LibraryService, private eventService:EventService) { }

  library!: IGadget[];
  ngOnInit(): void {

    this.getLibrary();
  }

  getLibrary(){

    this.libraryService.getLibrary().subscribe((libraryData)=>{
      this.library = libraryData;
    });
  }

  addGadget(gadgetData: IGadget){

    this.eventService.emitLibraryAddGadgetEvent({data:gadgetData})


  }

}
