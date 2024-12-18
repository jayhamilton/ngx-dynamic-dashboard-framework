import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatGridListModule } from '@angular/material/grid-list';
import { ImageComponent } from './image/image.component';
import { ImageService } from './image/image.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProductComponent } from './product/product.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { GadgetCommonModule } from './common/gadget-common/gadget-common.module';
import { GadgetGridCellHostComponent } from './gadget-grid-cell-host/gadget-grid-cell-host.component';
import { ScoreCardComponent } from './score-card/score-card.component';
import { DynamicFormModule } from '../dynamic-form/dynamic-form-module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatChipsModule} from '@angular/material/chips';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AreaChartComponent } from './area-chart/area-chart.component';
import { PckLineComponent } from './packaging-line/pck-line.component';
import { DateComponent } from './date/date.component';
import { NotificationComponent } from './notification/notification.component';
import { UsergroupComponent } from './usergroup/usergroup.component';
import { EventsComponent } from './events/events.component';
import { MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({ declarations: [
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
    ], imports: [CommonModule,
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
        FormsModule,
        MatChipsModule,
        NgxChartsModule,
        MatCheckboxModule], providers: [
        ImageService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class GadgetsModule {}
