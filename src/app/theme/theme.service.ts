import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  THEME_KEY: string = 'isDarkTheme';

  private isDarkSubject = new BehaviorSubject<boolean>(this.getStoredPreference());
  isDark$ = this.isDarkSubject.asObservable();

  constructor() {
    this.applyTheme(this.isDarkSubject.value);
  }

  toggleTheme() {
    const next = !this.isDarkSubject.value;
    localStorage.setItem(this.THEME_KEY, JSON.stringify(next));
    this.isDarkSubject.next(next);
    this.applyTheme(next);
  }

  private getStoredPreference(): boolean {
    const stored = localStorage.getItem(this.THEME_KEY);
    return stored != null ? JSON.parse(stored) : false;
  }

  private applyTheme(isDark: boolean) {
    document.body.classList.toggle('dark-theme', isDark);
  }
}
