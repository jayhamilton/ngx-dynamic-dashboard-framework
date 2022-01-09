import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationComponent } from '../configuration/configuration.component';
import { LibraryComponent } from '../library/library.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(public dialog:MatDialog) { }

  ngOnInit(): void {
  }

  openConfigDialog() {
    this.dialog.open(ConfigurationComponent,{
      width: '1000px',

    });
  }

  openGadgetLibraryDialog(){

    this.dialog.open(LibraryComponent,{
      width: '700px'
    });
  }
}

