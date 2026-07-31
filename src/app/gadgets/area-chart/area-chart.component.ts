import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AreaChartComponent extends GadgetBase  implements OnInit {

  curveShape:any =  curveBasis;
  multi: any[] = [];
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
    this.loadChartData();
  }

  override initializeConfiguration(gadgetData: any) {
    super.initializeConfiguration(gadgetData);
    this.loadChartData();
  }

  private loadChartData(): void {
    // Look for saved chartData in propertyPages
    let chartDataFound = false;
    
    if (this.propertyPages && this.propertyPages.length > 0) {
      this.propertyPages.forEach((page) => {
        page.properties.forEach((property) => {
          if (property.key === "chartData" && property.value) {
            try {
              this.multi = JSON.parse(property.value);
              chartDataFound = true;
            } catch (error) {
              console.error('Invalid JSON data for chart:', error);
            }
          }
        });
      });
    }
    
    // Load default data if no saved data found
    if (!chartDataFound) {
      this.loadDefaultData();
    }
  }

  private loadDefaultData(): void {
    const defaultData = [
      {
        "name": "Series 1",
        "series": [
          {"name": "Monday", "value": 320},
          {"name": "Tuesday", "value": 730},
          {"name": "Wednesday", "value": 294}
        ]
      },
      {
        "name": "Series 2",
        "series": [
          {"name": "Monday", "value": 480},
          {"name": "Tuesday", "value": 300},
          {"name": "Wednesday", "value": 180}
        ]
      }
    ];
    this.multi = defaultData;
  }

  remove() {
    this.eventService.emitGadgetDeleteEvent({ data: this.instanceId });
  }
  propertyChangeEvent(propertiesJSON: string) {
    console.log('AreaChart: propertyChangeEvent called with:', propertiesJSON);
    //update internal props
    const updatedPropsObject = JSON.parse(propertiesJSON);

    if (updatedPropsObject.title != undefined) {
      this.title = updatedPropsObject.title;
    }
    if (updatedPropsObject.subtitle != undefined) {
      this.subtitle = updatedPropsObject.subtitle;
      console.log.apply(this.subtitle);
    }
    if (updatedPropsObject.chartData != undefined) {
      try {
        console.log('AreaChart: Updating chart data to:', updatedPropsObject.chartData);
        this.multi = JSON.parse(updatedPropsObject.chartData);
        console.log('AreaChart: Chart data updated successfully:', this.multi);
        
        // Update property pages to sync between tabs
        this.updatePropertyPagesWithChartData(updatedPropsObject.chartData);
      } catch (error) {
        console.error('Invalid JSON data for chart:', error);
        // Keep existing data if JSON is invalid
      }
    }

    //persist changes
    this.boardService.savePropertyPageConfigurationToDestination(
      propertiesJSON,
      this.instanceId
    );
  }

  private updatePropertyPagesWithChartData(chartData: string) {
    console.log('AreaChart: Updating property pages with chart data');
    
    // Update all property pages that have chartData properties
    this.propertyPages.forEach((page) => {
      page.properties.forEach((property) => {
        if (property.key === 'chartData') {
          console.log('AreaChart: Found chartData property, updating value from:', property.value);
          console.log('AreaChart: To:', chartData);
          property.value = chartData;
        }
      });
    });
    
    console.log('AreaChart: Property pages updated');
  }

}
