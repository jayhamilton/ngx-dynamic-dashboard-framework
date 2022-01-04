import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatGridListModule } from '@angular/material/grid-list';
import { ImageComponent } from './image/image.component';
import { ImageService } from './image/image.service';

@NgModule({
  declarations: [
    ImageComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    MatGridListModule],
    exports: [
      ImageComponent
    ],
    providers: [
      ImageService
    ]

})
export class GadgetsModule {}
