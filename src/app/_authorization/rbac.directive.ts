import {
  Directive,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
    selector: '[checkPermissions]',
    standalone: false
})
export class RbacDirective implements OnInit, OnDestroy {
  userHasRole = false;
  stop = new Subject<any>();

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}
  ngOnInit(): void {
    //check the roles for the current user along with the component and instance info
    this.checkIfUserInRole();

    if (this.userHasRole) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }

  /**
   * check to see if the logged in user has access to the component
   * also check to see which permissions he has, read, write and or delete.
   */
  checkIfUserInRole() {
    
   
    let permissionInfo = sessionStorage.getItem('PRINCIPAL');

    console.log(permissionInfo);
    

    if (permissionInfo != null) {
      let permissionData: {
        message: string;
        status: string;
        user: { username: string; roles: Array<{ authority: string }> };
      } = JSON.parse(permissionInfo);

      this.userHasRole = true;
      return;
      
      /**
       * FIX ME
       * */

      if (permissionData['user'] && permissionData['user']['roles']) {
        let authorities = permissionData['user']['roles'];

        authorities.forEach((role) => {
          if (role.authority.includes('ADMIN')) {
            this.userHasRole = true;
          }
        });
      }
    }
  }

  // Clear the subscription on destroy
  ngOnDestroy() {
    this.stop.next({ value: '' });
  }
}
