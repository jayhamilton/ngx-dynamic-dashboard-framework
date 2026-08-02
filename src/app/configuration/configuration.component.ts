import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatTabGroup, MatTab, MatTabContent } from '@angular/material/tabs';
import { TabBoardsComponent } from './tab-boards/tab-boards.component';
import { TabApplicationComponent } from './tab-application/tab-application.component';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatTabGroup, MatTab, MatTabContent, TabBoardsComponent, TabApplicationComponent, MatDialogActions, MatButton, MatDialogClose]
})
export class ConfigurationComponent {

  @ViewChild('board',{read: ElementRef}) boardDialog?: ElementRef;

  closeDialog(){

    this.boardDialog?.nativeElement.click();

  }

}

