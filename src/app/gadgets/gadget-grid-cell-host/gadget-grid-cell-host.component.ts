import {
  Component,
  ViewContainerRef,
  input,
  effect,
  Type,
  ChangeDetectionStrategy
} from '@angular/core';
import { IGadget } from '../common/gadget-common/gadget-base/gadget.model';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { AnimationService } from '../../animation/animation.service';
import { GADGET_REGISTRY } from '../gadget-registry';

@Component({
    selector: 'gadget-grid-cell-host',
    template: '',
    changeDetection: ChangeDetectionStrategy.Eager
})
export class GadgetGridCellHostComponent {
  gadgetData = input.required<IGadget>();

  // Bumped on every gadgetData change so a dynamic import for a superseded
  // value can't create a component after a newer one already has.
  private loadToken = 0;

  constructor(
    private componentHost: ViewContainerRef,
    private animationService: AnimationService
  ) {
    effect(() => {
      const data = this.gadgetData();
      this.loadGadget(data);
    });
  }

  private async loadGadget(data: IGadget) {
    const token = ++this.loadToken;
    const loader = GADGET_REGISTRY[data.componentType];
    this.componentHost.clear();
    if (!loader) return;

    const componentType: Type<GadgetBase> = await loader();
    if (token !== this.loadToken) return;

    const gadgetRef = this.componentHost.createComponent(componentType);
    gadgetRef.instance.initializeConfiguration(data);

    // createComponent inserts the gadget as a sibling of this host element,
    // so the gadget's own root is what needs animating, not the host.
    const element: HTMLElement = gadgetRef.location.nativeElement;

    // Layout changes rebuild these components rather than moving them, so
    // stamp a stable id Flip can use to match the new element back to where
    // the old one was.
    element.setAttribute(AnimationService.FLIP_ID_ATTR, String(data.instanceId));

    this.animationService.gadgetEnter(element);
  }
}
