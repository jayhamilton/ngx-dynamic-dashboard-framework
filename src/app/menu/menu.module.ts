import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { ConfigurationModule } from '../configuration/configuration.module';
import { LibraryModule } from '../library/library.module';
import { RbacDirective } from '../_authorization/rbac.directive';
@NgModule({
  declarations: [MenuComponent, RbacDirective],
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    ConfigurationModule,
    MatDialogModule,
    LibraryModule,
  ],
  exports: [MenuComponent],
  providers: [],
})
export class MenuModule {}
