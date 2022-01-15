import { Injectable } from '@angular/core';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { Observable, Subject } from 'rxjs';

export interface IEvent {
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {

  private boardCreateRequestSubject: Subject<IEvent> = new Subject<IEvent>();
  private boardSelectedSubject: Subject<IEvent> = new Subject<IEvent>();

  private boardCreatedCompleteRequestSubject: Subject<IEvent> = new Subject<IEvent>();
  private boardDeleteRequestSubject: Subject<IEvent> = new Subject<IEvent>();
  private boardDeletedCompleteRequestSubject: Subject<IEvent> = new Subject<IEvent>();
  private sideNavClickEvent: Subject<IEvent> = new Subject<IEvent>();
  private addGadgetSubect: Subject<IEvent> = new Subject<IEvent>();

  private gadgetDeleteSubject: Subject<IEvent> = new Subject<IEvent>();

  private subscribers: Array<Subject<string>> = [];

  constructor() {}
  emitBoardMenuSideNavClickEvent() {
    this.sideNavClickEvent.next({data:{}});
  }
  listenForBoardMenuSideNavClickEvent(): Observable<IEvent> {
    return this.sideNavClickEvent.asObservable();
  }

  emitBoardSelectedEvent(event:IEvent) {
    this.boardSelectedSubject.next(event);
  }
  listenForBoardSelectedEvent(): Observable<IEvent> {
    return this.boardSelectedSubject.asObservable();
  }
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

  emitLibraryAddGadgetEvent(event: IEvent) {
    this.addGadgetSubect.next(event);
  }

  listenForLibraryAddGadgetEvents(): Observable<IEvent> {
    return this.addGadgetSubect.asObservable();
  }

  emitGadgetDeleteEvent(event: IEvent){
    this.gadgetDeleteSubject.next(event);
  }

  listenForGadgetDeleteEvent(): Observable<IEvent> {
    return this.gadgetDeleteSubject.asObservable();
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
