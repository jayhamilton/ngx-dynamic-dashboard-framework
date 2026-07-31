import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class BubbleChartComponent extends GadgetBase implements OnInit {
  chartData: any[] = [];

  colorScheme: Color = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
    name: '',
    selectable: false,
    group: ScaleType.Linear
  };

  chartLegend: boolean = false;
  chartLegendTitle: string = '';
  chartShowXAxis: boolean = false;
  chartShowYAxis: boolean = false;
  chartShowXAxisLabel: boolean = false;
  chartShowYAxisLabel: boolean = false;
  chartXAxisLabel: string = '';
  chartYAxisLabel: string = '';
  chartMinRadius: number = 3;
  chartMaxRadius: number = 20;

  constructor(private eventService: EventService, private boardService: BoardService) {
    super();
  }

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
          case 'chartMinRadius': this.chartMinRadius = Number(property.value) || 3; break;
          case 'chartMaxRadius': this.chartMaxRadius = Number(property.value) || 20; break;
        }
      });
    });
  }

  private loadChartData(): void {
    let found = false;
    if (this.propertyPages && this.propertyPages.length > 0) {
      this.propertyPages.forEach((page) => {
        page.properties.forEach((property: any) => {
          if (property.key === 'chartData' && property.value) {
            try {
              this.chartData = JSON.parse(property.value);
              found = true;
            } catch (e) { console.error('Invalid JSON for bubble chart:', e); }
          }
        });
      });
    }
    if (!found) {
      this.chartData = [
        {
          name: 'Group A',
          series: [
            { name: 'Jan', x: 10, y: 20, r: 8 },
            { name: 'Feb', x: 30, y: 40, r: 15 },
            { name: 'Mar', x: 50, y: 25, r: 10 }
          ]
        },
        {
          name: 'Group B',
          series: [
            { name: 'Jan', x: 20, y: 50, r: 12 },
            { name: 'Feb', x: 45, y: 15, r: 6 },
            { name: 'Mar', x: 60, y: 35, r: 18 }
          ]
        }
      ];
    }
  }

  remove() {
    this.eventService.emitGadgetDeleteEvent({ data: this.instanceId });
  }

  propertyChangeEvent(propertiesJSON: string) {
    const props = JSON.parse(propertiesJSON);
    if (props.title != undefined) this.title = props.title;
    if (props.subtitle != undefined) this.subtitle = props.subtitle;
    if (props.chartData != undefined) {
      try {
        this.chartData = JSON.parse(props.chartData);
        this.updatePropertyPageChartData(props.chartData);
      } catch (e) { console.error('Invalid JSON for bubble chart:', e); }
    }
    if (props.chartLegend != undefined) this.chartLegend = props.chartLegend === true || props.chartLegend === 'true';
    if (props.chartLegendTitle != undefined) this.chartLegendTitle = props.chartLegendTitle;
    if (props.chartShowXAxis != undefined) this.chartShowXAxis = props.chartShowXAxis === true || props.chartShowXAxis === 'true';
    if (props.chartShowYAxis != undefined) this.chartShowYAxis = props.chartShowYAxis === true || props.chartShowYAxis === 'true';
    if (props.chartShowXAxisLabel != undefined) this.chartShowXAxisLabel = props.chartShowXAxisLabel === true || props.chartShowXAxisLabel === 'true';
    if (props.chartShowYAxisLabel != undefined) this.chartShowYAxisLabel = props.chartShowYAxisLabel === true || props.chartShowYAxisLabel === 'true';
    if (props.chartXAxisLabel != undefined) this.chartXAxisLabel = props.chartXAxisLabel;
    if (props.chartYAxisLabel != undefined) this.chartYAxisLabel = props.chartYAxisLabel;
    if (props.chartMinRadius != undefined) this.chartMinRadius = Number(props.chartMinRadius) || 3;
    if (props.chartMaxRadius != undefined) this.chartMaxRadius = Number(props.chartMaxRadius) || 20;
    this.boardService.savePropertyPageConfigurationToDestination(propertiesJSON, this.instanceId);
  }

  private updatePropertyPageChartData(chartData: string) {
    this.propertyPages.forEach((page) => {
      page.properties.forEach((property: any) => {
        if (property.key === 'chartData') property.value = chartData;
      });
    });
  }
}
