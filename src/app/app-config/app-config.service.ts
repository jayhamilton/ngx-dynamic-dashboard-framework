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

  private appTitleSubject = new BehaviorSubject<string>(this.getStoredTitle());
  appTitle$ = this.appTitleSubject.asObservable();

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

  private getStoredTitle(): string {
    const stored = localStorage.getItem(this.APP_TITLE_KEY);
    return stored != null && stored.trim() !== ''
      ? stored
      : environment.applicationTitle;
  }
}
