import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventService } from 'src/app/eventservice/event.service';
import { environment } from 'src/environments/environment';
import { IEvent } from './schedule.service';



@Injectable()
export class EventDataService {
    events: Array<IEvent> = [];
   
    constructor(private httpClient: HttpClient, private eventService: EventService) { }

    getEvents() {
        return this.events;
    }

    setEvents(eventList: Array<IEvent>){
        this.events.length = 0;
        this.events = eventList;

        this.eventService.emitUserDataChanged();

    }

    loadEvents(){

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

            return this.httpClient.get<IEvent[]>(apiEndPoint, {
                headers,
            })
    }


}
