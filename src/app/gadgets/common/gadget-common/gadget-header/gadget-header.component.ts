import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventService } from 'src/app/eventservice/event.service';

@Component({
  selector: 'app-gadget-header',
  templateUrl: './gadget-header.component.html',
  styleUrls: ['./gadget-header.component.css'],
})
export class GadgetHeaderComponent implements OnInit {
  @Output() removeEvent: EventEmitter<any> = new EventEmitter();
  @Output() toggleConfigModeEvent: EventEmitter<any> = new EventEmitter();
  @Input() title: string;
  @Input() subtitle: string;
  @Input() iconpath: string;
  menuLabel = 'Configure';
  constructor(private eventService:EventService) {
    this.title = '';
    this.subtitle = '';
    this.iconpath = '';
  }

  ngOnInit(): void {}

  remove() {
    this.removeEvent.emit();
  }

  toggleConfigMode() {
    if (this.menuLabel === 'Configure') {
      this.menuLabel = 'Exit Configuration';
    } else {
      this.menuLabel = 'Configure';
       //TODO - alert board to reload config. Generalize this so that a single event can be used for this
       this.eventService.emitBoardGadgetPropertyChangeEvent();
    }
    this.toggleConfigModeEvent.emit();
  }
}
