import { AfterViewInit, Component, ChangeDetectionStrategy } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { HttpClient } from '@angular/common/http';

export interface footballstatsInterface {
  stats: any[];
}

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BarChartComponent extends GadgetBase implements AfterViewInit {
  footballstats: any[] = [];

  colorScheme: Color = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
    name: '',
    selectable: false,
    group: ScaleType.Linear
  };

  constructor(private eventService: EventService, private boardService: BoardService, private restClient: HttpClient) {
    super();
  }

  ngAfterViewInit(): void {
    this.getFootballStats().subscribe(data => {
      this.footballstats = data.stats;
      this.footballstats.sort((a, b) => b.value - a.value);
    });
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
    this.boardService.savePropertyPageConfigurationToDestination(
      propertiesJSON,
      this.instanceId
    );
  }

  getFootballStats() {
    return this.restClient.get<footballstatsInterface>('assets/api/footballstats.json');
  }
}
