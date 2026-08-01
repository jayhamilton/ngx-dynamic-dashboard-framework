import { AfterViewInit, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Color, ScaleType, BarChartModule } from '@swimlane/ngx-charts';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { HttpClient } from '@angular/common/http';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { GadgetHeaderComponent } from '../common/gadget-common/gadget-header/gadget-header.component';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';

export interface footballstatsInterface {
  stats: any[];
}

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCard, CdkDrag, GadgetHeaderComponent, MatCardContent, BarChartModule, DynamicFormComponent]
})
export class BarChartComponent extends GadgetBase implements AfterViewInit, OnInit {
  footballstats: any[] = [];

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
  chartRoundEdges: boolean = false;
  chartShowDataLabel: boolean = false;

  constructor(private eventService: EventService, private boardService: BoardService, private restClient: HttpClient) {
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

  ngAfterViewInit(): void {}

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
          case 'chartRoundEdges': this.chartRoundEdges = property.value === true || property.value === 'true'; break;
          case 'chartShowDataLabel': this.chartShowDataLabel = property.value === true || property.value === 'true'; break;
        }
      });
    });
  }

  private loadChartData(): void {
    let chartDataFound = false;

    if (this.propertyPages && this.propertyPages.length > 0) {
      this.propertyPages.forEach((page) => {
        page.properties.forEach((property) => {
          if (property.key === 'chartData' && property.value) {
            try {
              this.footballstats = JSON.parse(property.value);
              this.footballstats.sort((a, b) => b.value - a.value);
              chartDataFound = true;
            } catch (error) {
              console.error('Invalid JSON data for bar chart:', error);
            }
          }
        });
      });
    }

    if (!chartDataFound) {
      this.restClient.get<footballstatsInterface>('assets/api/footballstats.json').subscribe(data => {
        this.footballstats = data.stats;
        this.footballstats.sort((a, b) => b.value - a.value);
      });
    }
  }

  remove() {
    this.eventService.emitGadgetDeleteEvent({ data: this.instanceId });
  }

  propertyChangeEvent(propertiesJSON: string) {
    const updatedPropsObject = JSON.parse(propertiesJSON);

    if (updatedPropsObject.title != undefined) {
      this.title = updatedPropsObject.title;
    }
    if (updatedPropsObject.subtitle != undefined) {
      this.subtitle = updatedPropsObject.subtitle;
    }
    if (updatedPropsObject.chartData != undefined) {
      try {
        this.footballstats = JSON.parse(updatedPropsObject.chartData);
        this.footballstats.sort((a, b) => b.value - a.value);
        this.updatePropertyPagesWithChartData(updatedPropsObject.chartData);
      } catch (error) {
        console.error('Invalid JSON data for bar chart:', error);
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
    if (updatedPropsObject.chartRoundEdges != undefined) {
      this.chartRoundEdges = updatedPropsObject.chartRoundEdges === true || updatedPropsObject.chartRoundEdges === 'true';
    }
    if (updatedPropsObject.chartShowDataLabel != undefined) {
      this.chartShowDataLabel = updatedPropsObject.chartShowDataLabel === true || updatedPropsObject.chartShowDataLabel === 'true';
    }

    this.boardService.savePropertyPageConfigurationToDestination(
      propertiesJSON,
      this.instanceId
    );
  }

  private updatePropertyPagesWithChartData(chartData: string) {
    this.propertyPages.forEach((page) => {
      page.properties.forEach((property) => {
        if (property.key === 'chartData') {
          property.value = chartData;
        }
      });
    });
  }

  getFootballStats() {
    return this.restClient.get<footballstatsInterface>('assets/api/footballstats.json');
  }
}
