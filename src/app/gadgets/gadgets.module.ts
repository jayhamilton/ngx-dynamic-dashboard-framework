import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatGridListModule } from '@angular/material/grid-list';
import { ImageComponent } from './image/image.component';
import { ImageService } from './image/image.service';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProductComponent } from './product/product.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { GadgetCommonModule } from './common/gadget-common/gadget-common.module';
import { GadgetGridCellHostComponent } from './gadget-grid-cell-host/gadget-grid-cell-host.component';
import { ScoreCardComponent } from './score-card/score-card.component';
import { DynamicFormModule } from '../dynamic-form/dynamic-form-module';
import { HttpClientModule } from '@angular/common/http';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AreaChartComponent } from './area-chart/area-chart.component';
import { PckLineComponent } from './packaging-line/pck-line.component';
import { DateComponent } from './date/date.component';
import { NotificationComponent } from './notification/notification.component';
import { UsergroupComponent } from './usergroup/usergroup.component';
import { EventsComponent } from './events/events.component';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';

@NgModule({
  declarations: [
    ImageComponent,
    ProductComponent,
    GadgetGridCellHostComponent,
    ScoreCardComponent,
    BarChartComponent,
    AreaChartComponent,
    PckLineComponent,
    DateComponent,
    NotificationComponent,
    UsergroupComponent,
    EventsComponent

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
    GadgetCommonModule,
    DynamicFormModule,
    HttpClientModule,
    FormsModule,
    MatChipsModule,
    NgxChartsModule,
    MatCheckboxModule
  ],
    exports: [
      ImageComponent,
      ProductComponent,
      GadgetGridCellHostComponent,
      ScoreCardComponent,
      BarChartComponent,
      DateComponent,
      NotificationComponent,
      UsergroupComponent,
      EventsComponent
    ],
    providers: [
      ImageService

    ]

})
export class GadgetsModule {}
