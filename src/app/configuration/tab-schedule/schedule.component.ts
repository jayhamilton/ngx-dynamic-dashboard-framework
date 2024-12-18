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
    standalone: false
})
export class TabScheduleComponent implements OnInit {

  editMode = false;
  hours = new UntypedFormControl();
  minutes = new UntypedFormControl();
  description = new UntypedFormControl();
  form: UntypedFormGroup;
  hideRequiredControl = new UntypedFormControl(false); //TODO
  floatLabelControl = new UntypedFormControl('auto'); //TODO

  displayedColumns: string[] = ['Event Description', 'Time', 'Tools'];
  dataSource = new EventDataSource(ELEMENT_DATA);
  selectedId: number;
  constructor(private scheduleService: ScheduleService, private scheduleDataStoreService: ScheduleDataStoreService, formBuilder: UntypedFormBuilder) {
    this.selectedId = -1;
    this.form = formBuilder.group({

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
      this.dataSource.setData(eventList);
      this.resetForm();

      if (updateCache)
        this.scheduleDataStoreService.setEvents(eventList);

      this.resetForm()


    })
  }

  resetForm() {

    this.form.reset();
    
  }


  create() {

    if (this.editMode) {
      this.update();
    } else {

      this.scheduleService.createEvent(this.description.value, this.getDateTimeVal()).subscribe((event: any) => {
        this.get(true);
      })
    }
  }

  getDateTimeVal() {

    let _hours = formatNumber(this.hours.value, 'en-US', "2.0-0");
    let _minutes = formatNumber(this.minutes.value, 'en-US', "2.0-0");
    return _hours + ":" + _minutes;

  }


  edit(item: any) {

    this.description.setValue(item.description);
    this.hours.setValue(this.getHours(item.datetime));
    this.minutes.setValue(this.getMinutes(item.datetime));
    this.selectedId = item.id;
    this.editMode = true;
    this.form.markAsDirty();

  }

  getHours(datetime: string) {

    //parse string on : and bring back number of first value
    let hours = datetime.split(':');
    return formatNumber(Number(hours[0]), 'en-US', "2.0-0");
  }

  getMinutes(datetime: string) {

   //parse string on : and bring back number of first value
   let minutes = datetime.split(':');
   return formatNumber(Number(minutes[1]), 'en-US', "2.0-0");
  }


  resetEditMode(){
    this.editMode = false;
    this.resetForm();
  }

  update() {

    this.scheduleService.updateEvent(this.selectedId, this.description.value, this.getDateTimeVal()).subscribe((user: any) => {
      this.get(true);
      this.editMode = false;
    });
  }

  compare(c1: any, c2: any) {
    console.log(c1 + "  " + c2);
    return c1 && c2 && c1 === c2;
  }

  delete(item: any) {

    this.scheduleService.deleteEvent(item.id).subscribe((event: any) => {
      this.get(true);
    });

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

