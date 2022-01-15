import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatGridListModule } from '@angular/material/grid-list';
import { ImageComponent } from './image/image.component';
import { ImageService } from './image/image.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProductComponent } from './product/product.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { GadgetCommonModule } from './common/gadget-common/gadget-common.module';
@NgModule({
  declarations: [
    ImageComponent,
    ProductComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    MatGridListModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    GadgetCommonModule
  ],
    exports: [
      ImageComponent,
      ProductComponent
    ],
    providers: [
      ImageService
    ]

})
export class GadgetsModule {}
