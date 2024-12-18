import {
  Component,
  Input,
  ViewContainerRef,
  OnInit
} from '@angular/core';
import { AreaChartComponent } from '../area-chart/area-chart.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { IGadget } from '../common/gadget-common/gadget-base/gadget.model';
import { ImageComponent } from '../image/image.component';
import { PckLineComponent } from '../packaging-line/pck-line.component';
import { ProductComponent } from '../product/product.component';
import { ScoreCardComponent } from '../score-card/score-card.component';
import { DateComponent } from '../date/date.component';
import { NotificationComponent } from '../notification/notification.component';
import { UsergroupComponent } from '../usergroup/usergroup.component';
import { EventsComponent } from '../events/events.component';

/*
 this class handles the dynamic creation of components
 */

@Component({
    selector: 'gadget-grid-cell-host',
    template: '',
    standalone: false
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

    //TODO refactor and move to seperate clases
    switch (this.gadgetData.componentType) {
      case 'ProductComponent':
        gadgetRef = this.componentHost.createComponent(ProductComponent);
        break;
      case 'ImageComponent':
        gadgetRef = this.componentHost.createComponent(ImageComponent);
        break;
      case 'ScoreCardComponent':
        gadgetRef = this.componentHost.createComponent(ScoreCardComponent);
        break;
      case 'BarChartComponent':
          gadgetRef = this.componentHost.createComponent(BarChartComponent);
          break;
      case 'AreaChartComponent':
        gadgetRef = this.componentHost.createComponent(AreaChartComponent);
        break;
      case 'PckLineComponent':
        gadgetRef = this.componentHost.createComponent(PckLineComponent);
        break;
      case 'DateComponent':
        gadgetRef = this.componentHost.createComponent(DateComponent);
        break;
      case 'NotificationComponent':
        gadgetRef = this.componentHost.createComponent(NotificationComponent);
        break;
      case 'UsergroupComponent':
        gadgetRef = this.componentHost.createComponent(UsergroupComponent);
        break;
      case 'EventsComponent':
          gadgetRef = this.componentHost.createComponent(EventsComponent);
          break;
      default:
      //do nothing
    }

    if (gadgetRef) {
      gadgetRef.instance.initializeConfiguration(this.gadgetData);
    }
  }
}
