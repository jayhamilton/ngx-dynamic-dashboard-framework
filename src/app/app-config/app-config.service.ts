import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Holds application-level (not board-level) configuration. Currently just
 * the application title shown in the toolbar.
 *
 * Follows the same conventions as ThemeService: a BehaviorSubject so
 * subscribers get the current value on subscribe, persisted to
 * localStorage under a plain string key. environment.applicationTitle
 * is the default when nothing has been saved yet, so it stays the
 * build-time default rather than a hardcoded constant here.
 */
@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  APP_TITLE_KEY: string = 'applicationTitle';
  CARD_TRANSPARENT_KEY: string = 'cardBackgroundTransparent';

  private appTitleSubject = new BehaviorSubject<string>(this.getStoredTitle());
  appTitle$ = this.appTitleSubject.asObservable();

  private cardBackgroundTransparentSubject = new BehaviorSubject<boolean>(
    this.getStoredCardBackgroundTransparent()
  );
  cardBackgroundTransparent$ = this.cardBackgroundTransparentSubject.asObservable();

  constructor() {
    this.applyCardBackgroundTransparent(this.cardBackgroundTransparentSubject.value);
  }

  get appTitle(): string {
    return this.appTitleSubject.value;
  }

  setAppTitle(title: string) {
    const next = (title || '').trim() || environment.applicationTitle;
    localStorage.setItem(this.APP_TITLE_KEY, next);
    this.appTitleSubject.next(next);
  }

  resetAppTitle() {
    localStorage.removeItem(this.APP_TITLE_KEY);
    this.appTitleSubject.next(environment.applicationTitle);
  }

  get cardBackgroundTransparent(): boolean {
    return this.cardBackgroundTransparentSubject.value;
  }

  setCardBackgroundTransparent(value: boolean) {
    localStorage.setItem(this.CARD_TRANSPARENT_KEY, JSON.stringify(value));
    this.cardBackgroundTransparentSubject.next(value);
    this.applyCardBackgroundTransparent(value);
  }

  private getStoredTitle(): string {
    const stored = localStorage.getItem(this.APP_TITLE_KEY);
    return stored != null && stored.trim() !== ''
      ? stored
      : environment.applicationTitle;
  }

  private getStoredCardBackgroundTransparent(): boolean {
    const stored = localStorage.getItem(this.CARD_TRANSPARENT_KEY);
    return stored != null ? JSON.parse(stored) : false;
  }

  // Toggled on <body>, same pattern as ThemeService's dark-theme class, so
  // board.component.scss can target it with :host-context() without this
  // service needing to know about board-specific DOM/styling.
  private applyCardBackgroundTransparent(value: boolean) {
    document.body.classList.toggle('transparent-cards', value);
  }
}
