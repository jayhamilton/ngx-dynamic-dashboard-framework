import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-gadget-header',
  templateUrl: './gadget-header.component.html',
  styleUrls: ['./gadget-header.component.css']
})
export class GadgetHeaderComponent implements OnInit {

  @Output() removeEvent: EventEmitter<any> = new EventEmitter();
  @Input() title: string;
  @Input() subtitle: string;
  @Input() iconpath: string;
  constructor() {
    this.title = '';
    this.subtitle = '';
    this.iconpath ='';
  }

  ngOnInit(): void {
  }

  remove(){

    this.removeEvent.emit();
  }

}
