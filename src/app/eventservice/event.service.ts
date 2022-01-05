import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

interface IEvent {
  name: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private configurationSubject: Subject<IEvent> = new Subject<IEvent>();
  private librarySubject: Subject<IEvent> = new Subject<IEvent>();
  private subscribers: Array<Subject<string>> =[];

  constructor() {
  }

  raiseConfigurationEvent(event: IEvent) {
      this.configurationSubject.next(event);
  }

  listenForConfigurationEvents(): Observable<IEvent> {
      return this.configurationSubject.asObservable();
  }

  raiseLibraryEvent(event: IEvent) {
      this.librarySubject.next(event);
  }

  listenForLibraryEvents(): Observable<IEvent> {
      return this.librarySubject.asObservable();
  }

  addSubscriber(subscriber:any){
      this.subscribers.push(subscriber);
  }

  unSubscribeAll(){

    this.subscribers.forEach(subscription=>{
        subscription.unsubscribe();
    });

    this.subscribers.length = 0;

}

}
