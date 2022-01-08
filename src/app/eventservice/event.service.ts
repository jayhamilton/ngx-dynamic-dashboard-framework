import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface IEvent {
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

  raiseConfigurationRequestEvent(event: IEvent) {

    console.log("Tab Board Configuration Event Raised");
    console.log(event);
      this.configurationSubject.next(event);
  }
  raiseConfigurationCompletedEvent(event: IEvent) {
    this.configurationSubject.next(event);
}

  listenForConfigurationRequestEvents(): Observable<IEvent> {
      return this.configurationSubject.asObservable();
  }

  listenForConfigurationCompletedEvents(): Observable<IEvent> {
    return this.configurationSubject.asObservable();
}

  raiseLibraryRequestEvent(event: IEvent) {
      this.librarySubject.next(event);
  }
  raiseLibraryCompletedEvent(event: IEvent) {
    this.librarySubject.next(event);
}

  listenForLibraryRequestEvents(): Observable<IEvent> {
      return this.librarySubject.asObservable();
  }

  listenForLibraryCompletedEvents(): Observable<IEvent> {
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
