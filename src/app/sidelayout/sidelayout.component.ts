import { Component, OnInit } from '@angular/core';
import { EventService } from '../eventservice/event.service';

@Component({
  selector: 'app-sidelayout',
  templateUrl: './sidelayout.component.html',
  styleUrls: ['./sidelayout.component.css']
})
export class SidelayoutComponent implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
  }
  changeMenu(){
    console.log("changing menu");
    this.eventService.emitLayoutChange({data:"single"})
  }

}
