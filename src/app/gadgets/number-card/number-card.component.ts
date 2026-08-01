import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Color, ScaleType, NumberCardModule } from '@swimlane/ngx-charts';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { GadgetHeaderComponent } from '../common/gadget-common/gadget-header/gadget-header.component';

@Component({
    selector: 'app-number-card',
    templateUrl: './number-card.component.html',
    styleUrls: ['./number-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCard, CdkDrag, GadgetHeaderComponent, MatCardContent, NumberCardModule]
})
export class NumberCardComponent extends GadgetBase implements OnInit {
  chartData: any[] = [];

  colorScheme: Color = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
    name: '',
    selectable: false,
    group: ScaleType.Linear
  };

  chartCardColor: string = '';
  chartBandColor: string = '';
  chartTextColor: string = '';

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
          case 'chartCardColor': if (property.value) this.chartCardColor = property.value; break;
          case 'chartBandColor': if (property.value) this.chartBandColor = property.value; break;
          case 'chartTextColor': if (property.value) this.chartTextColor = property.value; break;
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
            } catch (e) { console.error('Invalid JSON for number card:', e); }
          }
        });
      });
    }
    if (!found) {
      this.chartData = [
        { name: 'Revenue', value: 312000 },
        { name: 'Units', value: 1540 },
        { name: 'Customers', value: 248 },
        { name: 'Returns', value: 12 }
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
      } catch (e) { console.error('Invalid JSON for number card:', e); }
    }
    if (props.chartCardColor != undefined) this.chartCardColor = props.chartCardColor;
    if (props.chartBandColor != undefined) this.chartBandColor = props.chartBandColor;
    if (props.chartTextColor != undefined) this.chartTextColor = props.chartTextColor;
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
