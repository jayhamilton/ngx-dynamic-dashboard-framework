import { OutputEmitter } from '@angular/compiler/src/output/abstract_emitter';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { FileUploadService } from './file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit {

  @Output() fileUploadEvent:EventEmitter<any> = new EventEmitter();

  loading: boolean;
  file!: File;
  constructor(private fileUploadService: FileUploadService) {
    this.loading = false;
  }

  ngOnInit(): void {}
  onChange(event: any) {
    console.log(event);
    this.file = event.target.files[0];
    console.log(event.target.files);

    this.fileUploadEvent.emit(event.target.files);


    this.loading = !this.loading;

    this.fileUploadService.upload(this.file).subscribe((event) => {
      if (typeof event === 'object') {
        this.loading = false;
      }
    });
  }
}


