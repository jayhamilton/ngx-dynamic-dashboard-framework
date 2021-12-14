import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {IEvent} from './IEvent';


@Injectable()
export class MenuEventService {

    private menuSubject: Subject<IEvent> = new Subject<IEvent>();

    constructor() {
    }

    raiseMenuEvent(eventI: IEvent) {
      this.menuSubject.next(eventI);
    }

    listenForMenuEvents(): Observable<IEvent> {
      return this.menuSubject.asObservable();
  }
}
