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
  private boardUpdateNameDescriptionSubject: Subject<IEvent> = new Subject<IEvent>();
  private boardSelectedSubject: Subject<IEvent> = new Subject<IEvent>();

  private boardCreatedCompleteRequestSubject: Subject<IEvent> =
    new Subject<IEvent>();
  private boardDeleteRequestSubject: Subject<IEvent> = new Subject<IEvent>();
  private boardDeletedCompleteRequestSubject: Subject<IEvent> =
    new Subject<IEvent>();
  private sideNavClickEvent: Subject<IEvent> = new Subject<IEvent>();
  private sideLayoutSubject: Subject<IEvent> = new Subject<IEvent>();
  private addGadgetSubect: Subject<IEvent> = new Subject<IEvent>();
  private libraryMenuSubject: Subject<IEvent> = new Subject<IEvent>();
  private sideMenuLayoutSelectSubject: Subject<IEvent> = new Subject<IEvent>();
  private boardAddRowSubject: Subject<IEvent> = new Subject<IEvent>();
  private boardRemoveRowSubject: Subject<IEvent> = new Subject<IEvent>();
  private boardRowsChangedSubject: Subject<IEvent> = new Subject<IEvent>();
  private gadgetPropertyChangeSubject: Subject<IEvent> = new Subject<IEvent>();
  private gadgetDeleteSubject: Subject<IEvent> = new Subject<IEvent>();
  private userDataChangedSubject: Subject<IEvent> = new Subject<IEvent>();
  private scheduleEventDataChangedSubject: Subject<IEvent> = new Subject<IEvent>();
  private chartDataChangedSubject: Subject<IEvent> = new Subject<IEvent>();
  private openConfigPanelSubject: Subject<IEvent> = new Subject<IEvent>();
  private closeConfigPanelSubject: Subject<IEvent> = new Subject<IEvent>();
  private configPanelClosedSubject: Subject<IEvent> = new Subject<IEvent>();
  private closeLibraryPanelSubject: Subject<IEvent> = new Subject<IEvent>();


  private subscribers: Array<Subject<string>> = [];

  constructor() {}

  emptyEvent: IEvent = {
    data: {},
  };

  emitLibraryMenuOpenEvent() {
    this.libraryMenuSubject.next(this.emptyEvent);
  }
  listenForLibraryOpenMenuEvent(): Observable<IEvent> {
    return this.libraryMenuSubject.asObservable();
  }

  emitCloseLibraryPanelEvent() {
    this.closeLibraryPanelSubject.next(this.emptyEvent);
  }
  listenForCloseLibraryPanelEvent(): Observable<IEvent> {
    return this.closeLibraryPanelSubject.asObservable();
  }

  emitBoardMenuSideNavClickEvent() {
    this.sideNavClickEvent.next({ data: {} });
  }
  listenForBoardMenuSideNavClickEvent(): Observable<IEvent> {
    return this.sideNavClickEvent.asObservable();
  }

  emitBoardSelectedEvent(event: IEvent) {
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

  emitBoardUpdateNameDescription(event: IEvent){
    this.boardUpdateNameDescriptionSubject.next(event);
  }
  listenForBoardUpdateNameDescriptionRequestEvent(): Observable<IEvent> {
    return this.boardUpdateNameDescriptionSubject.asObservable();
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

  emitGadgetDeleteEvent(event: IEvent) {
    this.gadgetDeleteSubject.next(event);
  }

  listenForGadgetDeleteEvent(): Observable<IEvent> {
    return this.gadgetDeleteSubject.asObservable();
  }

  emitBoardSideLayoutClickEvent() {
    this.sideLayoutSubject.next(this.emptyEvent);
  }

  listenForBoardSideLayoutEvent(): Observable<IEvent> {
    return this.sideLayoutSubject.asObservable();
  }

  emitBoardGadgetPropertyChangeEvent(){
    this.gadgetPropertyChangeSubject.next(this.emptyEvent);
  }
  listenForGadgetPropertyChangeEvents(): Observable<IEvent>{
    return this.gadgetPropertyChangeSubject.asObservable();
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

  emitLayoutChange(event: IEvent) {
    this.sideMenuLayoutSelectSubject.next(event);
  }

  listenForLayoutChangeEvent(): Observable<IEvent> {
    return this.sideMenuLayoutSelectSubject.asObservable();
  }

  emitBoardAddRowEvent() {
    this.boardAddRowSubject.next(this.emptyEvent);
  }

  listenForBoardAddRowEvent(): Observable<IEvent> {
    return this.boardAddRowSubject.asObservable();
  }

  emitBoardRemoveRowEvent(event: IEvent) {
    this.boardRemoveRowSubject.next(event);
  }

  listenForBoardRemoveRowEvent(): Observable<IEvent> {
    return this.boardRemoveRowSubject.asObservable();
  }

  // Emitted by the board once a row add/remove/layout change has been applied
  // and saved. The layout panel owns no board state of its own, so it uses
  // this to re-read the board and refresh its row list.
  emitBoardRowsChangedEvent(event: IEvent) {
    this.boardRowsChangedSubject.next(event);
  }

  listenForBoardRowsChangedEvent(): Observable<IEvent> {
    return this.boardRowsChangedSubject.asObservable();
  }


  emitUserDataChanged() {
    this.userDataChangedSubject.next(this.emptyEvent);
  }

  listenForUserDataChangedEvent(): Observable<IEvent> {
    return this.userDataChangedSubject.asObservable();
  }

  emitScheduleEventDataChanged() {
    this.scheduleEventDataChangedSubject.next(this.emptyEvent);
  }

  listenForScheduleEventDataChangedEvent(): Observable<IEvent> {
    return this.scheduleEventDataChangedSubject.asObservable();
  }

  emitChartDataChanged(event: IEvent) {
    console.log('EventService: Emitting chart data change:', event);
    this.chartDataChangedSubject.next(event);
  }

  listenForChartDataChangedEvent(): Observable<IEvent> {
    return this.chartDataChangedSubject.asObservable();
  }

  emitOpenConfigPanelEvent(event: IEvent) {
    this.openConfigPanelSubject.next(event);
  }

  listenForOpenConfigPanelEvent(): Observable<IEvent> {
    return this.openConfigPanelSubject.asObservable();
  }

  emitCloseConfigPanelEvent() {
    this.closeConfigPanelSubject.next(this.emptyEvent);
  }

  listenForCloseConfigPanelEvent(): Observable<IEvent> {
    return this.closeConfigPanelSubject.asObservable();
  }

  // Fired once the config panel drawer has actually finished closing,
  // regardless of why (close button, backdrop click, escape key, or being
  // closed programmatically e.g. by opening another side panel) — the
  // single reliable signal for "this gadget instance is no longer being
  // configured", unlike emitCloseConfigPanelEvent which is only a request.
  emitConfigPanelClosedEvent(event: IEvent) {
    this.configPanelClosedSubject.next(event);
  }

  listenForConfigPanelClosedEvent(): Observable<IEvent> {
    return this.configPanelClosedSubject.asObservable();
  }
}
//emitScheduledEventDataChanged