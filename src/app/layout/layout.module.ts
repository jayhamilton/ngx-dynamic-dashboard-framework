import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidelayoutComponent } from './layout.component';
import { LayoutService } from './layout.service';

@NgModule({
  declarations: [SidelayoutComponent],
  imports: [CommonModule],
  exports: [SidelayoutComponent],
  providers: [LayoutService],
})
export class SidelayoutModule {}
