import { Directive, ViewContainerRef } from "@angular/core"

@Directive({
  selector: '[appGrid]'
})
export class BoardGridDirective{
  constructor(public viewContainerRef: ViewContainerRef){}

}

