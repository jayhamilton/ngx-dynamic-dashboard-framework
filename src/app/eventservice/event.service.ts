import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface IEvent {
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private boardCreateRequestSubject: Subject<IEvent> = new Subject<IEvent>();
  private boardCreatedCompleteRequestSubject: Subject<IEvent> = new Subject<IEvent>();
  private boardDeleteRequestSubject: Subject<IEvent> = new Subject<IEvent>();
  private boardDeletedCompleteRequestSubject: Subject<IEvent> = new Subject<IEvent>();

  private librarySubject: Subject<IEvent> = new Subject<IEvent>();
  private subscribers: Array<Subject<string>> = [];

  constructor() {}

  emitBoardCreateRequestEvent(event: IEvent) {
    this.boardCreateRequestSubject.next(event);
  }

  emitBoardCreatedCompleteEvent(event: IEvent) {
    this.boardCreatedCompleteRequestSubject.next(event);
  }

  listenForBoardCreateRequestEvent(): Observable<IEvent> {
    return this.boardCreateRequestSubject.asObservable();
  }
  listenForBoardCreatedCompleteEvent(): Observable<IEvent> {
    return this.boardCreatedCompleteRequestSubject.asObservable();
  }

  emitBoardDeleteRequestEvent(event: IEvent) {
    this.boardDeleteRequestSubject.next(event);
  }

  emitBoardDeletedCompleteEvent(event: IEvent) {
    this.boardDeletedCompleteRequestSubject.next(event);
  }

  listenForBoardDeleteRequestEvent(): Observable<IEvent> {
    return this.boardDeleteRequestSubject.asObservable();
  }
  listenForBoardDeletedCompleteEvent(): Observable<IEvent> {
    return this.boardDeletedCompleteRequestSubject.asObservable();
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

  addSubscriber(subscriber: any) {
    this.subscribers.push(subscriber);
  }

  unSubscribeAll() {
    this.subscribers.forEach((subscription) => {
      subscription.unsubscribe();
    });

    this.subscribers.length = 0;
  }
}
