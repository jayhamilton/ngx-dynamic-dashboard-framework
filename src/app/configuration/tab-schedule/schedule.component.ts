import { DataSource } from '@angular/cdk/collections';
import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { EventDataService } from './schedule.data.service';
import { ScheduleService } from './schedule.service';

export interface ISchedule {

  id: number;
  description: string;
  time: string;
}

const ELEMENT_DATA: ISchedule[] = [];
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
  constructor(private scheduleService: ScheduleService, private eventDataService: EventDataService, formBuilder: UntypedFormBuilder) {

    this.formControls = formBuilder.group({

      hours: this.hours,
      minutes: this.minutes,
      description: this.description,
      floatLabelControl: this.floatLabelControl,
      hideRequiredControl: this.hideRequiredControl

    });

  }

  ngOnInit(): void {
    this.get();
  }

  get() {

  }


  create() {

    let _hours = formatNumber(this.hours.value, 'en-US', "2.0-0");
    let _minutes = formatNumber(this .minutes.value, 'en-US', "2.0-0");

    ELEMENT_DATA.push({ id: ELEMENT_DATA.length + 1, description: this.description.value, time: _hours + ":" + _minutes });
    this.dataSource.setData(ELEMENT_DATA);
    this.eventDataService.setEvents(ELEMENT_DATA);
    
  
  }


  edit(item: any) {

  }

  compare(c1: any, c2: any) {
    console.log(c1 + "  " + c2);
    return c1 && c2 && c1 === c2;
  }

  delete(item: any) {

    this.scheduleService.deleteEvent(item.id).subscribe((event: any) => {
      this.get();
    })

  }
}


class EventDataSource extends DataSource<ISchedule> {
  private _dataStream = new ReplaySubject<ISchedule[]>();

  constructor(initialData: ISchedule[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<ISchedule[]> {
    return this._dataStream;
  }

  disconnect() { }

  setData(data: ISchedule[]) {
    this._dataStream.next(data);
  }
}

