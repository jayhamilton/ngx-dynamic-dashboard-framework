import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationComponent } from './configuration.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TabProductsComponent } from './tab-products/tab-products.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TabBoardsComponent } from './tab-boards/tab-boards.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TabRbacComponent } from './tab-rbac/rbac.component';
import { RBACUserService } from './tab-rbac/rbac.service';
import { TabScheduleComponent } from './tab-schedule/schedule.component';
import { ScheduleService } from './tab-schedule/schedule.service';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { EventDataService } from './tab-schedule/schedule.data.service';



@NgModule({
  declarations: [
    ConfigurationComponent,
    TabProductsComponent,
    TabBoardsComponent,
    TabRbacComponent,
    TabScheduleComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTabsModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  providers: [RBACUserService, ScheduleService, EventDataService],
  exports:[
    ConfigurationComponent
  ]
})
export class ConfigurationModule { }
