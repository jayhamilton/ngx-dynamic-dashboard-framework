import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { TokenInterceptor } from './app.interceptor';
import { BOARD_REPOSITORY } from './board/board-repository.model';
import { LocalStorageBoardRepository } from './board/local-storage-board.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    // Swap for a RestBoardRepository (implementing the same
    // IBoardRepository contract) once a real backend exists — nothing
    // above this line, in BoardService, or in any component needs to
    // change.
    { provide: BOARD_REPOSITORY, useClass: LocalStorageBoardRepository },
  ],
};
