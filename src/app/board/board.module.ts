import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { BoardService } from './board.service';
import {MatGridListModule} from '@angular/material/grid-list';



@NgModule({
  declarations: [
    BoardComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    MatGridListModule
  ],
  exports:[
    BoardComponent
  ],
  providers:[
    BoardService
  ]
})
export class BoardModule { }
