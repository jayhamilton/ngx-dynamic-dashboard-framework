/**
 * Created by jayhamilton on 2/5/17.
 */
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  style,
  state,
  trigger,
  animate,
  transition,
} from '@angular/animations';

import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PropertyControlService } from './property-control.service';
import { EventService } from '../eventservice/event.service';
import {
  IPropertyPage,
  ITag,
} from '../gadgets/common/gadget-common/gadget-base/gadget.model';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { DynamicFormPropertyComponent } from './dynamic-form-property.component';
import { MatButton } from '@angular/material/button';

@Component({
    /* solves error: Expression has changed after it was checked exception resolution - https://www.youtube.com/watch?v=K_BRcal-JfI*/
    // changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./styles-props.scss'],
    animations: [
        trigger('contentSwitch', [
            state('inactive', style({
                opacity: 0,
            })),
            state('active', style({
                opacity: 1,
            })),
            transition('inactive => active', animate('750ms ease-in')),
            transition('active => inactive', animate('750ms ease-out')),
        ]),
        trigger('showHideAnimation', [
            transition(':enter', [
                // :enter is alias to 'void => *'
                style({ opacity: 0 }),
                animate(750, style({ opacity: 1 })),
            ]),
            transition(':leave', [
                // :leave is alias to '* => void'
                animate(750, style({ opacity: 0 })),
            ]),
        ]),
    ],
    providers: [PropertyControlService],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, ReactiveFormsModule, MatTabGroup, MatTab, DynamicFormPropertyComponent, MatButton]
})
export class DynamicFormComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() gadgetTags: ITag[]; //todo - use to control what endpoints are displayed
  @Input() propertyPages: IPropertyPage[];
  @Input() instanceId: number;
  @Output() updatePropertiesEvent: EventEmitter<any> = new EventEmitter(true);

  currentTab = 'run';
  state = 'inactive';
  lastActiveTab = {};
  selected = new UntypedFormControl(0);
  @Input() tabIndex: number;

  form: UntypedFormGroup = new UntypedFormGroup({});
  payLoad = '';
  showMessage: boolean = false;
  private destroy$ = new Subject<void>();
  // Torn down and recreated each time buildForm() runs, so the valueChanges
  // subscription for a previous gadget's form doesn't linger after the panel
  // switches to a different gadget.
  private formDestroy$ = new Subject<void>();
  private showMessageTimer: any = null;

  constructor(
    private pcs: PropertyControlService,
    private eventService: EventService,
    private changeDetectionRef: ChangeDetectorRef
  ) {
    this.gadgetTags = []; //todo - use to control what endpoints are displayed
    this.propertyPages = [];
    this.instanceId = -20;
    this.tabIndex = this.selected.value;
    console.log('this selected');
    console.log(this.selected);
  }

  /* better solution that solves error: Expression has changed after it was checked exception resolution*/
  ngAfterViewInit(): void {
    this.changeDetectionRef.detectChanges();
  }

  ngOnInit() {
    // ngOnChanges already builds the form — it fires before ngOnInit for the
    // initial bound @Input() values, and again on every later gadget switch.
  }

  ngOnChanges(changes: SimpleChanges) {
    // The config panel reuses a single DynamicFormComponent instance across
    // gadgets, only pushing new @Input() values — rebuild the form whenever
    // the selected gadget changes, or property values (and the stale-value
    // bug) from the previous gadget carry over into the new one.
    if (changes['propertyPages'] || changes['instanceId']) {
      this.buildForm();
    }
  }

  private buildForm() {
    // Tear down the previous form's subscription before replacing it, and
    // clear any leftover "Saved!" flash/payload from the prior gadget.
    this.formDestroy$.next();
    if (this.showMessageTimer) clearTimeout(this.showMessageTimer);
    this.showMessage = false;
    this.payLoad = '';

    this.form = this.pcs.toFormGroupFromPP(this.propertyPages);

    // Subscribe to form value changes for real-time updates with debouncing
    this.form.valueChanges.pipe(
      debounceTime(100), // Reduced delay for more responsive updates
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      takeUntil(this.formDestroy$),
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      console.log('DynamicForm: Form value changed (debounced), emitting update:', value);
      this.payLoad = JSON.stringify(value);
      this.updatePropertiesEvent.emit(this.payLoad);
    });
  }

  saveForm() {
    this.payLoad = JSON.stringify(this.form.value);
    this.updatePropertiesEvent.emit(this.payLoad);

    if (this.payLoad) {
      this.showMessage = true;
      if (this.showMessageTimer) clearTimeout(this.showMessageTimer);
      // setTimeout isn't an Angular-recognized trigger under zoneless change
      // detection, so the mutation below needs an explicit check.
      this.showMessageTimer = setTimeout(() => {
        this.showMessage = false;
        this.changeDetectionRef.detectChanges();
      }, 2000);
    }

    //console.log(this.payLoad);
  }

  get isPropertyPageValid() {
    return this.form.valid;
  }
  setSelected(event: any) {
    console.log(event);
  }

  onTabChange(event: any) {
    console.log('DynamicForm: Tab changed to index:', event.index);
    // Emit tab change event so ACE editors can refresh if needed
    this.eventService.emitChartDataChanged({
      data: {
        source: 'tab-change',
        tabIndex: event.index,
        tabLabel: event.tab.textLabel
      }
    });
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.showMessageTimer) clearTimeout(this.showMessageTimer);
  }
}
