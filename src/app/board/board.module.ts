import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { BoardService } from './board.service';
import {MatGridListModule} from '@angular/material/grid-list';
import { GadgetsModule } from '../gadgets/gadgets.module';
import { BoardGridDirective,  } from './boardgrid.directive';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [
    BoardComponent,
    BoardGridDirective
  ],
  imports: [
    CommonModule,
    DragDropModule,
    MatGridListModule,
    GadgetsModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule
  ],
  exports:[
    BoardComponent
  ],
  providers:[
    BoardService
  ]
})
export class BoardModule { }
