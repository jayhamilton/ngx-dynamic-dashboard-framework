import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Color, ScaleType, PieChartModule } from '@swimlane/ngx-charts';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { GadgetHeaderComponent } from '../common/gadget-common/gadget-header/gadget-header.component';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';

@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCard, CdkDrag, GadgetHeaderComponent, MatCardContent, PieChartModule, DynamicFormComponent]
})
export class PieChartComponent extends GadgetBase implements OnInit {
  chartData: any[] = [];

  colorScheme: Color = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
    name: '',
    selectable: false,
    group: ScaleType.Linear
  };

  chartLegend: boolean = false;
  chartLegendTitle: string = '';
  chartGradient: boolean = false;
  chartShowLabels: boolean = false;
  chartDoughnut: boolean = false;
  chartExplodeSlices: boolean = false;

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
          case 'chartGradient': this.chartGradient = property.value === true || property.value === 'true'; break;
          case 'chartShowLabels': this.chartShowLabels = property.value === true || property.value === 'true'; break;
          case 'chartDoughnut': this.chartDoughnut = property.value === true || property.value === 'true'; break;
          case 'chartExplodeSlices': this.chartExplodeSlices = property.value === true || property.value === 'true'; break;
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
            } catch (e) { console.error('Invalid JSON for pie chart:', e); }
          }
        });
      });
    }
    if (!found) {
      this.chartData = [
        { name: 'Q1', value: 8940 },
        { name: 'Q2', value: 5000 },
        { name: 'Q3', value: 7200 },
        { name: 'Q4', value: 6100 }
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
      } catch (e) { console.error('Invalid JSON for pie chart:', e); }
    }
    if (props.chartLegend != undefined) this.chartLegend = props.chartLegend === true || props.chartLegend === 'true';
    if (props.chartLegendTitle != undefined) this.chartLegendTitle = props.chartLegendTitle;
    if (props.chartGradient != undefined) this.chartGradient = props.chartGradient === true || props.chartGradient === 'true';
    if (props.chartShowLabels != undefined) this.chartShowLabels = props.chartShowLabels === true || props.chartShowLabels === 'true';
    if (props.chartDoughnut != undefined) this.chartDoughnut = props.chartDoughnut === true || props.chartDoughnut === 'true';
    if (props.chartExplodeSlices != undefined) this.chartExplodeSlices = props.chartExplodeSlices === true || props.chartExplodeSlices === 'true';
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
