import {
  Component,
  Input,
  ViewContainerRef,
  OnInit
} from '@angular/core';
import { IGadget } from '../common/gadget-common/gadget-base/gadget.model';
import { ImageComponent } from '../image/image.component';
import { ProductComponent } from '../product/product.component';
import { ScoreCardComponent } from '../score-card/score-card.component';

/*
 this class handles the dynamic creation of components
 */

@Component({
  selector: 'gadget-grid-cell-host',
  template: '',
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
      default:
      //do nothing
    }

    if (gadgetRef) {
      gadgetRef.instance.setConfiguration(this.gadgetData);
    }
  }
}
