import {
  Component,
  Input,
  ViewContainerRef,
  OnInit,
  ComponentFactoryResolver,
} from '@angular/core';
import { IGadget } from '../gadgets/common/gadget-common/gadget-base/gadget.model';
import { ImageComponent } from '../gadgets/image/image.component';
import { ProductComponent } from '../gadgets/product/product.component';

/*
 this class handles the dynamic creation of components
 */

@Component({
  selector: 'app-grid-cell',
  template: '',
})
export class CellComponent implements OnInit {
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
      default:
      //do nothing
    }

    if (gadgetRef) {
      gadgetRef.instance.setConfiguration(this.gadgetData);
    }
  }
}
