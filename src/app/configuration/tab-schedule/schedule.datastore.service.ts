import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventService } from 'src/app/eventservice/event.service';
import { environment } from 'src/environments/environment';
import { IScheduledEvent } from './schedule.service';

@Injectable()
export class ScheduleDataStoreService {
    events: Array<IScheduledEvent> = [];
   
    constructor(private httpClient: HttpClient, private eventService: EventService) { }

    getEvents() {
        return this.events;
    }

    setEvents(eventList: Array<IScheduledEvent>){
        this.events.length = 0;
        this.events = eventList;

        this.eventService.emitScheduleEventDataChanged();

    }

    loadScheduledEvents(){

        this.callUsersAPI().subscribe(_events=>{

            this.events.length = 0;
            _events.forEach(event=>{

                this.events.push(event);
            })

        })
    }

    callUsersAPI() {

        
            let apiEndPoint = environment.apihost + environment.eventAPI;

            let sessionKey = sessionStorage.getItem(environment.sessionToken);

            let headers = new HttpHeaders({
                Authorization: '' + sessionKey,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            });

            const body = { title: 'Angular Get Request Example' };

            return this.httpClient.get<IScheduledEvent[]>(apiEndPoint, {
                headers,
            })
    }


}
