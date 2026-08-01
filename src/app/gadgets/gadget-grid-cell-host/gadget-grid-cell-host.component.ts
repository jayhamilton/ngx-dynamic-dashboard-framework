import {
  Component,
  Input,
  ViewContainerRef,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { AreaChartComponent } from '../area-chart/area-chart.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { BubbleChartComponent } from '../bubble-chart/bubble-chart.component';
import { NumberCardComponent } from '../number-card/number-card.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { IGadget } from '../common/gadget-common/gadget-base/gadget.model';

@Component({
    selector: 'gadget-grid-cell-host',
    template: '',
    changeDetection: ChangeDetectionStrategy.Eager
})
export class GadgetGridCellHostComponent implements OnInit {
  @Input() gadgetData: IGadget;

  constructor(private componentHost: ViewContainerRef) {
    this.gadgetData = {
      componentType: '',
      title: '',
      subtitle: '',
      description: '',
      icon: '',
      instanceId: -1,
      tags: [],
      propertyPages: [],
      actions: [],
    };
  }

  ngOnInit() {
    let gadgetRef = null;

    switch (this.gadgetData.componentType) {
      case 'BarChartComponent':
        gadgetRef = this.componentHost.createComponent(BarChartComponent);
        break;
      case 'AreaChartComponent':
        gadgetRef = this.componentHost.createComponent(AreaChartComponent);
        break;
      case 'PieChartComponent':
        gadgetRef = this.componentHost.createComponent(PieChartComponent);
        break;
      case 'BubbleChartComponent':
        gadgetRef = this.componentHost.createComponent(BubbleChartComponent);
        break;
      case 'NumberCardComponent':
        gadgetRef = this.componentHost.createComponent(NumberCardComponent);
        break;
      case 'LineChartComponent':
        gadgetRef = this.componentHost.createComponent(LineChartComponent);
        break;
      default:
        // do nothing
    }

    if (gadgetRef) {
      gadgetRef.instance.initializeConfiguration(this.gadgetData);
    }
  }
}
