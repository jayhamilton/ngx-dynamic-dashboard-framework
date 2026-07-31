import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ConfigurationComponent {

  @ViewChild('board',{read: ElementRef}) boardDialog?: ElementRef;

  closeDialog(){

    this.boardDialog?.nativeElement.click();

  }

}

