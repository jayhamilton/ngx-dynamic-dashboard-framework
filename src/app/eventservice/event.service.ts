import { ApplicationRef, Injectable } from '@angular/core';
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
  private boardWidthChangeSubject: Subject<IEvent> = new Subject<IEvent>();
  private boardAddRowSubject: Subject<IEvent> = new Subject<IEvent>();
  private boardRemoveRowSubject: Subject<IEvent> = new Subject<IEvent>();
  private boardMoveRowSubject: Subject<IEvent> = new Subject<IEvent>();
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
  private openHelpPanelSubject: Subject<IEvent> = new Subject<IEvent>();
  private closeHelpPanelSubject: Subject<IEvent> = new Subject<IEvent>();
  private openAgentPanelSubject: Subject<IEvent> = new Subject<IEvent>();
  private closeAgentPanelSubject: Subject<IEvent> = new Subject<IEvent>();


  private subscribers: Array<Subject<string>> = [];

  // Zoneless Angular only auto-schedules a re-render for a specific set of
  // triggers (template events, signals, async pipe, explicit tick()) — a
  // subscribe() callback reacting to one of these Subjects doesn't
  // qualify. Scheduling a tick after every emit restores the "any event
  // may need a redraw" behavior zone.js used to provide automatically,
  // without requiring every listener across the app to call
  // markForCheck() itself.
  constructor(private appRef: ApplicationRef) {}

  private tickScheduled = false;

  // Emits routinely cascade synchronously — one emit's subscriber emits
  // another event, whose subscriber emits another, etc. (e.g. creating a
  // board: emitBoardCreateRequestEvent → BoardService creates it →
  // emitBoardCreatedCompleteEvent → BoardComponent/MenuComponent update
  // their own state). Calling appRef.tick() inline on every individual
  // emit ticks the whole tree multiple times per user action, each catching
  // it at a different partial-settle point — which trips Angular's
  // dev-mode "ExpressionChangedAfterItHasBeenCheckedError" check, since a
  // later nested emit changes a binding a tick already rendered earlier in
  // the same synchronous cascade. Coalescing into one microtask-scheduled
  // tick — the same pattern Angular's own zoneless scheduler uses — means
  // the whole cascade finishes and settles first, and the tree is only
  // ever checked once it's stable.
  private scheduleTick(): void {
    if (this.tickScheduled) return;
    this.tickScheduled = true;
    queueMicrotask(() => {
      this.tickScheduled = false;
      this.appRef.tick();
    });
  }

  emptyEvent: IEvent = {
    data: {},
  };

  emitLibraryMenuOpenEvent() {
    this.libraryMenuSubject.next(this.emptyEvent);
    this.scheduleTick();
  }
  listenForLibraryOpenMenuEvent(): Observable<IEvent> {
    return this.libraryMenuSubject.asObservable();
  }

  emitCloseLibraryPanelEvent() {
    this.closeLibraryPanelSubject.next(this.emptyEvent);
    this.scheduleTick();
  }
  listenForCloseLibraryPanelEvent(): Observable<IEvent> {
    return this.closeLibraryPanelSubject.asObservable();
  }

  emitBoardMenuSideNavClickEvent() {
    this.sideNavClickEvent.next({ data: {} });
    this.scheduleTick();
  }
  listenForBoardMenuSideNavClickEvent(): Observable<IEvent> {
    return this.sideNavClickEvent.asObservable();
  }

  emitBoardSelectedEvent(event: IEvent) {
    this.boardSelectedSubject.next(event);
    this.scheduleTick();
  }
  listenForBoardSelectedEvent(): Observable<IEvent> {
    return this.boardSelectedSubject.asObservable();
  }
  emitBoardCreateRequestEvent(event: IEvent) {
    this.boardCreateRequestSubject.next(event);
    this.scheduleTick();
  }

  emitBoardCreatedCompleteEvent(event: IEvent) {
    this.boardCreatedCompleteRequestSubject.next(event);
    this.scheduleTick();
  }

  listenForBoardCreateRequestEvent(): Observable<IEvent> {
    return this.boardCreateRequestSubject.asObservable();
  }
  listenForBoardCreatedCompleteEvent(): Observable<IEvent> {
    return this.boardCreatedCompleteRequestSubject.asObservable();
  }

  emitBoardUpdateNameDescription(event: IEvent){
    this.boardUpdateNameDescriptionSubject.next(event);
    this.scheduleTick();
  }
  listenForBoardUpdateNameDescriptionRequestEvent(): Observable<IEvent> {
    return this.boardUpdateNameDescriptionSubject.asObservable();
  }

  emitBoardDeleteRequestEvent(event: IEvent) {
    this.boardDeleteRequestSubject.next(event);
    this.scheduleTick();
  }

  emitBoardDeletedCompleteEvent(event: IEvent) {
    this.boardDeletedCompleteRequestSubject.next(event);
    this.scheduleTick();
  }

  listenForBoardDeleteRequestEvent(): Observable<IEvent> {
    return this.boardDeleteRequestSubject.asObservable();
  }
  listenForBoardDeletedCompleteEvent(): Observable<IEvent> {
    return this.boardDeletedCompleteRequestSubject.asObservable();
  }

  emitLibraryAddGadgetEvent(event: IEvent) {
    this.addGadgetSubect.next(event);
    this.scheduleTick();
  }

  listenForLibraryAddGadgetEvents(): Observable<IEvent> {
    return this.addGadgetSubect.asObservable();
  }

  emitGadgetDeleteEvent(event: IEvent) {
    this.gadgetDeleteSubject.next(event);
    this.scheduleTick();
  }

  listenForGadgetDeleteEvent(): Observable<IEvent> {
    return this.gadgetDeleteSubject.asObservable();
  }

  emitBoardSideLayoutClickEvent() {
    this.sideLayoutSubject.next(this.emptyEvent);
    this.scheduleTick();
  }

  listenForBoardSideLayoutEvent(): Observable<IEvent> {
    return this.sideLayoutSubject.asObservable();
  }

  emitBoardGadgetPropertyChangeEvent(){
    this.gadgetPropertyChangeSubject.next(this.emptyEvent);
    this.scheduleTick();
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
    this.scheduleTick();
  }

  listenForLayoutChangeEvent(): Observable<IEvent> {
    return this.sideMenuLayoutSelectSubject.asObservable();
  }

  emitBoardWidthChangeEvent(event: IEvent) {
    this.boardWidthChangeSubject.next(event);
    this.scheduleTick();
  }

  listenForBoardWidthChangeEvent(): Observable<IEvent> {
    return this.boardWidthChangeSubject.asObservable();
  }

  emitBoardAddRowEvent() {
    this.boardAddRowSubject.next(this.emptyEvent);
    this.scheduleTick();
  }

  listenForBoardAddRowEvent(): Observable<IEvent> {
    return this.boardAddRowSubject.asObservable();
  }

  emitBoardRemoveRowEvent(event: IEvent) {
    this.boardRemoveRowSubject.next(event);
    this.scheduleTick();
  }

  listenForBoardRemoveRowEvent(): Observable<IEvent> {
    return this.boardRemoveRowSubject.asObservable();
  }

  emitBoardMoveRowEvent(event: IEvent) {
    this.boardMoveRowSubject.next(event);
    this.scheduleTick();
  }

  listenForBoardMoveRowEvent(): Observable<IEvent> {
    return this.boardMoveRowSubject.asObservable();
  }

  // Emitted by the board once a row add/remove/layout change has been applied
  // and saved. The layout panel owns no board state of its own, so it uses
  // this to re-read the board and refresh its row list.
  emitBoardRowsChangedEvent(event: IEvent) {
    this.boardRowsChangedSubject.next(event);
    this.scheduleTick();
  }

  listenForBoardRowsChangedEvent(): Observable<IEvent> {
    return this.boardRowsChangedSubject.asObservable();
  }


  emitUserDataChanged() {
    this.userDataChangedSubject.next(this.emptyEvent);
    this.scheduleTick();
  }

  listenForUserDataChangedEvent(): Observable<IEvent> {
    return this.userDataChangedSubject.asObservable();
  }

  emitScheduleEventDataChanged() {
    this.scheduleEventDataChangedSubject.next(this.emptyEvent);
    this.scheduleTick();
  }

  listenForScheduleEventDataChangedEvent(): Observable<IEvent> {
    return this.scheduleEventDataChangedSubject.asObservable();
  }

  emitChartDataChanged(event: IEvent) {
    console.log('EventService: Emitting chart data change:', event);
    this.chartDataChangedSubject.next(event);
    this.scheduleTick();
  }

  listenForChartDataChangedEvent(): Observable<IEvent> {
    return this.chartDataChangedSubject.asObservable();
  }

  emitOpenConfigPanelEvent(event: IEvent) {
    this.openConfigPanelSubject.next(event);
    this.scheduleTick();
  }

  listenForOpenConfigPanelEvent(): Observable<IEvent> {
    return this.openConfigPanelSubject.asObservable();
  }

  emitCloseConfigPanelEvent() {
    this.closeConfigPanelSubject.next(this.emptyEvent);
    this.scheduleTick();
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
    this.scheduleTick();
  }

  listenForConfigPanelClosedEvent(): Observable<IEvent> {
    return this.configPanelClosedSubject.asObservable();
  }

  emitOpenHelpPanelEvent(event: IEvent) {
    this.openHelpPanelSubject.next(event);
    this.scheduleTick();
  }

  listenForOpenHelpPanelEvent(): Observable<IEvent> {
    return this.openHelpPanelSubject.asObservable();
  }

  emitCloseHelpPanelEvent() {
    this.closeHelpPanelSubject.next(this.emptyEvent);
    this.scheduleTick();
  }

  listenForCloseHelpPanelEvent(): Observable<IEvent> {
    return this.closeHelpPanelSubject.asObservable();
  }

  emitOpenAgentPanelEvent() {
    this.openAgentPanelSubject.next(this.emptyEvent);
    this.scheduleTick();
  }

  listenForOpenAgentPanelEvent(): Observable<IEvent> {
    return this.openAgentPanelSubject.asObservable();
  }

  emitCloseAgentPanelEvent() {
    this.closeAgentPanelSubject.next(this.emptyEvent);
    this.scheduleTick();
  }

  listenForCloseAgentPanelEvent(): Observable<IEvent> {
    return this.closeAgentPanelSubject.asObservable();
  }
}
//emitScheduledEventDataChanged