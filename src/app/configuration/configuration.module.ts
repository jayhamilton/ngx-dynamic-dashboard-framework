import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationComponent } from './configuration.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { TabProductsComponent } from './tab-products/tab-products.component';
import {MatLegacyTabsModule as MatTabsModule} from '@angular/material/legacy-tabs';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import { MatIconModule} from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TabBoardsComponent } from './tab-boards/tab-boards.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import {MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { TabUserComponent } from './tab-user/user.component';
import { UserService } from './tab-user/user.service';
import { TabScheduleComponent } from './tab-schedule/schedule.component';
import { ScheduleService } from './tab-schedule/schedule.service';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    ConfigurationComponent,
    TabProductsComponent,
    TabBoardsComponent,
    TabUserComponent,
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
    FormsModule,
    MatSortModule
  ],
  providers: [UserService, ScheduleService],
  exports:[
    ConfigurationComponent
  ]
})
export class ConfigurationModule { }
