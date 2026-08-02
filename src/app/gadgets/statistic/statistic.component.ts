import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';
import { GadgetHeaderComponent } from '../common/gadget-common/gadget-header/gadget-header.component';

/** Trend direction derived from the configured change value. */
type TrendDirection = 'up' | 'down' | 'flat';

@Component({
    selector: 'app-statistic',
    templateUrl: './statistic.component.html',
    styleUrls: ['./statistic.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCard, CdkDrag, GadgetHeaderComponent, MatCardContent, MatIcon]
})
export class StatisticComponent extends GadgetBase implements OnInit {
  statValue: string = '0';
  statLabel: string = '';
  statCaption: string = '';
  statIcon: string = 'insights';
  statTheme: string = 'brand';
  statChange: string = '';
  showIcon: boolean = true;

  constructor(private eventService: EventService, private boardService: BoardService) {
    super();
  }

  ngOnInit(): void {
    this.loadProperties();
  }

  override initializeConfiguration(gadgetData: any) {
    super.initializeConfiguration(gadgetData);
    this.loadProperties();
  }

  /**
   * A change of "+12.5%" / "-3" / "0" drives both the arrow and its color.
   * Anything non-numeric (e.g. "n/a") is shown as-is with no direction.
   */
  get trend(): TrendDirection {
    const numeric = parseFloat(this.statChange.replace(/[^0-9.\-+]/g, ''));
    if (isNaN(numeric) || numeric === 0) return 'flat';
    return numeric > 0 ? 'up' : 'down';
  }

  get trendIcon(): string {
    switch (this.trend) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      default: return 'trending_flat';
    }
  }

  private toBool(value: any): boolean {
    return value === true || value === 'true';
  }

  private loadProperties(): void {
    if (!this.propertyPages) return;
    this.propertyPages.forEach((page) => {
      page.properties.forEach((property: any) => {
        switch (property.key) {
          case 'statValue':
            if (property.value != null && property.value !== '') this.statValue = String(property.value);
            break;
          case 'statLabel':
            this.statLabel = property.value || '';
            break;
          case 'statCaption':
            this.statCaption = property.value || '';
            break;
          case 'statIcon':
            if (property.value) this.statIcon = property.value;
            break;
          case 'statTheme':
            if (property.value) this.statTheme = property.value;
            break;
          case 'statChange':
            this.statChange = property.value || '';
            break;
          case 'showIcon':
            this.showIcon = this.toBool(property.value);
            break;
        }
      });
    });
  }

  remove() {
    this.eventService.emitGadgetDeleteEvent({ data: this.instanceId });
  }

  propertyChangeEvent(propertiesJSON: string) {
    const props = JSON.parse(propertiesJSON);

    if (props.title != undefined) this.title = props.title;
    if (props.subtitle != undefined) this.subtitle = props.subtitle;
    if (props.statValue != undefined) this.statValue = String(props.statValue);
    if (props.statLabel != undefined) this.statLabel = props.statLabel;
    if (props.statCaption != undefined) this.statCaption = props.statCaption;
    if (props.statIcon != undefined) this.statIcon = props.statIcon;
    if (props.statTheme != undefined) this.statTheme = props.statTheme;
    if (props.statChange != undefined) this.statChange = props.statChange;
    if (props.showIcon != undefined) this.showIcon = this.toBool(props.showIcon);

    this.boardService.savePropertyPageConfigurationToDestination(propertiesJSON, this.instanceId);
  }
}
