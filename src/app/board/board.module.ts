import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { BoardService } from './board.service';
import {MatGridListModule} from '@angular/material/grid-list';
import { GadgetsModule } from '../gadgets/gadgets.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
@NgModule({
  declarations: [
    BoardComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    MatGridListModule,
    GadgetsModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule
  ],
  exports:[
    BoardComponent
  ],
  providers:[
    BoardService
  ]
})
export class BoardModule { }
