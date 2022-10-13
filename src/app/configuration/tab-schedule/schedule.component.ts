import { DataSource } from '@angular/cdk/collections';
import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { ScheduleDataStoreService } from './schedule.datastore.service';
import { IScheduledEvent, ScheduleService } from './schedule.service';


const ELEMENT_DATA: IScheduledEvent[] = [];
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class TabScheduleComponent implements OnInit {

  hours = new UntypedFormControl();
  minutes = new UntypedFormControl();
  description = new UntypedFormControl();
  formControls: UntypedFormGroup;
  hideRequiredControl = new UntypedFormControl(false); //TODO
  floatLabelControl = new UntypedFormControl('auto'); //TODO



  displayedColumns: string[] = ['Id', 'Event Description', 'Time', 'Tools'];
  dataSource = new EventDataSource(ELEMENT_DATA);
  constructor(private scheduleService: ScheduleService, private scheduleDataStoreService: ScheduleDataStoreService, formBuilder: UntypedFormBuilder) {

    this.formControls = formBuilder.group({

      hours: this.hours,
      minutes: this.minutes,
      description: this.description,
      floatLabelControl: this.floatLabelControl,
      hideRequiredControl: this.hideRequiredControl

    });

  }

  ngOnInit(): void {
    this.get(false);
  }

  get(updateCache: boolean) {

    this.scheduleService.getEvents().subscribe((eventList: IScheduledEvent[]) => {

      console.log(eventList)
      this.dataSource.setData(eventList);

      if(updateCache)
        this.scheduleDataStoreService.setEvents(eventList);

    })
  }


  create() {

    let _hours = formatNumber(this.hours.value, 'en-US', "2.0-0");
    let _minutes = formatNumber(this.minutes.value, 'en-US', "2.0-0");

    this.scheduleService.createEvent(this.description.value, _hours + ":" + _minutes).subscribe((event: any) => {
      this.get(true);
    })
  }


  edit(item: any) {

  }

  compare(c1: any, c2: any) {
    console.log(c1 + "  " + c2);
    return c1 && c2 && c1 === c2;
  }

  delete(item: any) {

    this.scheduleService.deleteEvent(item.id).subscribe((event: any) => {
      this.get(true);
    })

  }
}


class EventDataSource extends DataSource<IScheduledEvent> {
  private _dataStream = new ReplaySubject<IScheduledEvent[]>();

  constructor(initialData: IScheduledEvent[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<IScheduledEvent[]> {
    return this._dataStream;
  }

  disconnect() { }

  setData(data: IScheduledEvent[]) {
    this._dataStream.next(data);
  }
}

