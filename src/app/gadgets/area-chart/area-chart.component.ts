import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ScaleType, AreaChartModule } from '@swimlane/ngx-charts';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { curveBasis } from 'd3-shape';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { GadgetHeaderComponent } from '../common/gadget-common/gadget-header/gadget-header.component';


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
    imports: [MatCard, CdkDrag, GadgetHeaderComponent, MatCardContent, AreaChartModule]
})
export class AreaChartComponent extends GadgetBase  implements OnInit {

  curveShape:any =  curveBasis;
  multi: any[] = [];
// options
chartLegend: boolean = false;
chartLegendTitle: string = '';
chartShowXAxis: boolean = false;
chartShowYAxis: boolean = false;
chartShowXAxisLabel: boolean = false;
chartShowYAxisLabel: boolean = false;
chartXAxisLabel: string = '';
chartYAxisLabel: string = '';
chartGradient: boolean = false;
chartTimeline: boolean = false;
chartAnimations: boolean = false;



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
    this.loadChartProperties();
  }

  override initializeConfiguration(gadgetData: any) {
    super.initializeConfiguration(gadgetData);
    this.loadChartData();
    this.loadChartProperties();
  }

  private loadChartProperties(): void {
    if (!this.propertyPages) return;
    this.propertyPages.forEach((page) => {
      page.properties.forEach((property: any) => {
        switch (property.key) {
          case 'chartLegend': this.chartLegend = property.value === true || property.value === 'true'; break;
          case 'chartLegendTitle': if (property.value) this.chartLegendTitle = property.value; break;
          case 'chartShowXAxis': this.chartShowXAxis = property.value === true || property.value === 'true'; break;
          case 'chartShowYAxis': this.chartShowYAxis = property.value === true || property.value === 'true'; break;
          case 'chartShowXAxisLabel': this.chartShowXAxisLabel = property.value === true || property.value === 'true'; break;
          case 'chartShowYAxisLabel': this.chartShowYAxisLabel = property.value === true || property.value === 'true'; break;
          case 'chartXAxisLabel': if (property.value) this.chartXAxisLabel = property.value; break;
          case 'chartYAxisLabel': if (property.value) this.chartYAxisLabel = property.value; break;
          case 'chartGradient': this.chartGradient = property.value === true || property.value === 'true'; break;
          case 'chartTimeline': this.chartTimeline = property.value === true || property.value === 'true'; break;
          case 'chartAnimations': this.chartAnimations = property.value === true || property.value === 'true'; break;
        }
      });
    });
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
    //update internal props
    const updatedPropsObject = JSON.parse(propertiesJSON);

    if (updatedPropsObject.title != undefined) {
      this.title = updatedPropsObject.title;
    }
    if (updatedPropsObject.subtitle != undefined) {
      this.subtitle = updatedPropsObject.subtitle;
    }
    if (updatedPropsObject.chartData != undefined) {
      try {
        this.multi = JSON.parse(updatedPropsObject.chartData);
        // Update property pages to sync between tabs
        this.updatePropertyPagesWithChartData(updatedPropsObject.chartData);
      } catch (error) {
        console.error('Invalid JSON data for chart:', error);
        // Keep existing data if JSON is invalid
      }
    }
    if (updatedPropsObject.chartLegend != undefined) {
      this.chartLegend = updatedPropsObject.chartLegend === true || updatedPropsObject.chartLegend === 'true';
    }
    if (updatedPropsObject.chartLegendTitle != undefined) {
      this.chartLegendTitle = updatedPropsObject.chartLegendTitle;
    }
    if (updatedPropsObject.chartShowXAxis != undefined) {
      this.chartShowXAxis = updatedPropsObject.chartShowXAxis === true || updatedPropsObject.chartShowXAxis === 'true';
    }
    if (updatedPropsObject.chartShowYAxis != undefined) {
      this.chartShowYAxis = updatedPropsObject.chartShowYAxis === true || updatedPropsObject.chartShowYAxis === 'true';
    }
    if (updatedPropsObject.chartShowXAxisLabel != undefined) {
      this.chartShowXAxisLabel = updatedPropsObject.chartShowXAxisLabel === true || updatedPropsObject.chartShowXAxisLabel === 'true';
    }
    if (updatedPropsObject.chartShowYAxisLabel != undefined) {
      this.chartShowYAxisLabel = updatedPropsObject.chartShowYAxisLabel === true || updatedPropsObject.chartShowYAxisLabel === 'true';
    }
    if (updatedPropsObject.chartXAxisLabel != undefined) {
      this.chartXAxisLabel = updatedPropsObject.chartXAxisLabel;
    }
    if (updatedPropsObject.chartYAxisLabel != undefined) {
      this.chartYAxisLabel = updatedPropsObject.chartYAxisLabel;
    }
    if (updatedPropsObject.chartGradient != undefined) {
      this.chartGradient = updatedPropsObject.chartGradient === true || updatedPropsObject.chartGradient === 'true';
    }
    if (updatedPropsObject.chartTimeline != undefined) {
      this.chartTimeline = updatedPropsObject.chartTimeline === true || updatedPropsObject.chartTimeline === 'true';
    }
    if (updatedPropsObject.chartAnimations != undefined) {
      this.chartAnimations = updatedPropsObject.chartAnimations === true || updatedPropsObject.chartAnimations === 'true';
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
