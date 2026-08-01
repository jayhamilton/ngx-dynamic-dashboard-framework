import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Color, ScaleType, LineChartModule } from '@swimlane/ngx-charts';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { curveBasis } from 'd3-shape';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { GadgetHeaderComponent } from '../common/gadget-common/gadget-header/gadget-header.component';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCard, CdkDrag, GadgetHeaderComponent, MatCardContent, LineChartModule, DynamicFormComponent]
})
export class LineChartComponent extends GadgetBase implements OnInit {
  chartData: any[] = [];
  curveShape: any = curveBasis;

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
  chartGradient: boolean = false;
  chartTimeline: boolean = false;
  chartAnimations: boolean = false;

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
          case 'chartGradient': this.chartGradient = property.value === true || property.value === 'true'; break;
          case 'chartTimeline': this.chartTimeline = property.value === true || property.value === 'true'; break;
          case 'chartAnimations': this.chartAnimations = property.value === true || property.value === 'true'; break;
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
            } catch (e) { console.error('Invalid JSON for line chart:', e); }
          }
        });
      });
    }
    if (!found) {
      this.chartData = [
        {
          name: 'Series 1',
          series: [
            { name: 'Mon', value: 320 },
            { name: 'Tue', value: 730 },
            { name: 'Wed', value: 294 },
            { name: 'Thu', value: 510 },
            { name: 'Fri', value: 420 }
          ]
        },
        {
          name: 'Series 2',
          series: [
            { name: 'Mon', value: 480 },
            { name: 'Tue', value: 300 },
            { name: 'Wed', value: 180 },
            { name: 'Thu', value: 390 },
            { name: 'Fri', value: 620 }
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
      } catch (e) { console.error('Invalid JSON for line chart:', e); }
    }
    if (props.chartLegend != undefined) this.chartLegend = props.chartLegend === true || props.chartLegend === 'true';
    if (props.chartLegendTitle != undefined) this.chartLegendTitle = props.chartLegendTitle;
    if (props.chartShowXAxis != undefined) this.chartShowXAxis = props.chartShowXAxis === true || props.chartShowXAxis === 'true';
    if (props.chartShowYAxis != undefined) this.chartShowYAxis = props.chartShowYAxis === true || props.chartShowYAxis === 'true';
    if (props.chartShowXAxisLabel != undefined) this.chartShowXAxisLabel = props.chartShowXAxisLabel === true || props.chartShowXAxisLabel === 'true';
    if (props.chartShowYAxisLabel != undefined) this.chartShowYAxisLabel = props.chartShowYAxisLabel === true || props.chartShowYAxisLabel === 'true';
    if (props.chartXAxisLabel != undefined) this.chartXAxisLabel = props.chartXAxisLabel;
    if (props.chartYAxisLabel != undefined) this.chartYAxisLabel = props.chartYAxisLabel;
    if (props.chartGradient != undefined) this.chartGradient = props.chartGradient === true || props.chartGradient === 'true';
    if (props.chartTimeline != undefined) this.chartTimeline = props.chartTimeline === true || props.chartTimeline === 'true';
    if (props.chartAnimations != undefined) this.chartAnimations = props.chartAnimations === true || props.chartAnimations === 'true';
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
