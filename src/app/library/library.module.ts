import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryComponent } from './library.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    LibraryComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatButtonModule
  ]
})
export class LibraryModule { }
