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
