import { Component, OnInit } from '@angular/core';
import { IGadget } from '../gadgets/gadget.model';
import { LibraryService } from './library.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  constructor(private libraryService: LibraryService) { }

  library!: IGadget[];
  ngOnInit(): void {

    this.getLibrary();
  }

  getLibrary(){

    this.libraryService.getLibrary().subscribe((library)=>{
      this.library = library;
    });
  }

}
