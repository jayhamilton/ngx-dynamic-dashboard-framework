import { Component, OnInit } from '@angular/core';
import { ScaleType } from '@swimlane/ngx-charts';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { curveBasis } from 'd3-shape';


export interface Color {
  name: string;
  selectable: boolean;
  group: ScaleType;
  domain: string[];
}
@Component({
    selector: 'app-area-chart',
    templateUrl: './area-chart.component.html',
    styleUrls: ['./area-chart.component.scss'],
    standalone: false
})
export class AreaChartComponent extends GadgetBase  implements OnInit {

  curveShape:any =  curveBasis;
  multi = [
    {
      "name": "Armani",
      "series": [
        {
          "name": "Monday",
          "value": 320
        },
        {
          "name": "Wednesday",
          "value": 730
        },
        {
          "name": "Friday",
          "value": 294
        }
      ]
    },
    {
      "name": "GUUCI",
      "series": [
        {
          "name": "Monday",
          "value": 480
        },
        {
          "name": "Wednesday",
          "value": 300
        },
        {
          "name": "Friday",
          "value": 180
        }
      ]
    },

    {
      "name": "Ralph Lauren",
      "series": [
        {
          "name": "Monday",
          "value": 250
        },
        {
          "name": "Wednesday",
          "value": 309
        },
        {
          "name": "Friday",
          "value": 111
        }
      ]
    },
    {
      "name": "Polo",
      "series": [
        {
          "name": "Monday",
          "value": 157
        },
        {
          "name": "Wednesday",
          "value": 62
        },
        {
          "name": "Friday",
          "value": 80
        }
      ]
    }
  ];
// options
legend: boolean = true;
showLabels: boolean = true;
animations: boolean = true;
xAxis: boolean = true;
yAxis: boolean = true;
showYAxisLabel: boolean = true;
showXAxisLabel: boolean = true;
xAxisLabel: string = 'February Week 3 2022';
yAxisLabel: string = 'Output';
timeline: boolean = true;



colorScheme:Color = {
  domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
  name: '',
  selectable: false,
  group: ScaleType.Linear
};

  constructor(private eventService: EventService, private boardService: BoardService) {
    super();
  }

  view: any[] = [700, 300];

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

}
