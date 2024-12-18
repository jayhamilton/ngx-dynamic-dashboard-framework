import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ImageUploadService } from './file-upload.service';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
    standalone: false
})
export class FileUploadComponent implements OnInit {
  @Output() fileUploadEvent: EventEmitter<any> = new EventEmitter();

  loading: boolean;

  constructor(private imageUploadService: ImageUploadService) {
    this.loading = false;
  }

  ngOnInit(): void {}
  onChange(event: any) {
    console.log(event);

    console.log(event.target.files);

    this.fileUploadEvent.emit(event.target.files);

    this.loading = !this.loading;

    this.imageUploadService.upload(event.target.files).subscribe({
      next: (event) => {
        console.log('PRINTING IN NEXT SECTION');
        console.log(event);
      },
      error: (error) => {
        console.log('PRINTING ERROR CONDITION');
        console.log(error);
      },
    });
  }
}
