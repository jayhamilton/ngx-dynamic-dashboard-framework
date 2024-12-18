import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryComponent } from './library.component';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { LibraryService } from './library.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({ declarations: [
        LibraryComponent
    ], imports: [CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        ScrollingModule,
        MatDialogModule], providers: [
        LibraryService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class LibraryModule { }
