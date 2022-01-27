import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidelayoutComponent } from './sidelayout.component';
import { LayoutService } from './sidelayout.service';

@NgModule({
  declarations: [SidelayoutComponent],
  imports: [CommonModule],
  exports: [SidelayoutComponent],
  providers: [LayoutService],
})
export class SidelayoutModule {}
