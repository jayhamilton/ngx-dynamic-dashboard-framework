import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { variance } from 'd3';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent extends GadgetBase implements OnInit {
  // changed variables and added names and values for football stats array 
  players = "Players";
  yards = "Total Yards";
  footballstats = [
    { name: "mason", value: 105 },
    { name: "mendez", value: 550 },
    { name: "reily", value: 150 },
    { name: "mickens", value: 750 },
    { name: "jamie", value: 850 },
    { name: "ortiz", value: 105 },
    { name: "willis", value: 550 },
    { name: "primus", value: 250 },
    { name: "burges", value: 350 },
    { name: "lewis", value: 50 }
  ];
  average = this.getAverage();
  variance = this.getVariance();
  standardDeviation = this.getStandardDeviation();
  colorScheme: Color = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
    name: '',
    selectable: false,
    group: ScaleType.Linear
  };

  constructor(private eventService: EventService, private boardService: BoardService) {
    super();
  }

  ngOnInit(): void {
  }


  remove() {
    this.eventService.emitGadgetDeleteEvent({ data: this.instanceId });
  }
  propertyChangeEvent(propertiesJSON: string) {
    //update internal props
    const updatedPropsObject = JSON.parse(propertiesJSON);

    if (updatedPropsObject.title != undefined) {
      this.title = updatedPropsObject.title;
    }
    if (updatedPropsObject.subtitle != undefined) {
      this.subtitle = updatedPropsObject.subtitle;
      console.log.apply(this.subtitle);
    }



    //persist changes
    this.boardService.savePropertyPageConfigurationToDestination(
      propertiesJSON,
      this.instanceId
    );
  }

  getAverage() {

    let sum = 0;
    this.footballstats.forEach(data => {

      sum = data.value + sum;

    });

    return sum / this.footballstats.length;
    // return (105 + 550 + 150 + 750 + 850 + 105 + 550 + 250 + 350 + 50)/ 10; 
  }
  getVariance() {

    let sum = 0;
    this.footballstats.forEach(data => {

      sum = data.value + sum;

    });

    let average = sum / this.footballstats.length;

    let variance = 0;
    this.footballstats.forEach(data => {

      variance = ((data.value - average) ** 2 + variance);

    });
    let varianceTotal = variance / this.footballstats.length;

    return varianceTotal;

    // return (105 + 550 + 150 + 750 + 850 + 105 + 550 + 250 + 350 + 50)/ 10; 
  }
  getStandardDeviation() {

   let sd= Math.sqrt(this.variance);

    return Math.round(sd);
  }
}