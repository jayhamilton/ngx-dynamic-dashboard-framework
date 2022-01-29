import { Component, OnInit } from '@angular/core';
import { FileUploadService } from './file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit {
  loading: boolean;
  file!: File;
  constructor(private fileUploadService: FileUploadService) {
    this.loading = false;
  }

  ngOnInit(): void {}
  onChange(event: any) {
    console.log(event);
    this.file = event.target.files[0];

    this.loading = !this.loading;
    //service logic
    this.fileUploadService.upload(this.file).subscribe((event) => {
      if (typeof event === 'object') {
        this.loading = false;
      }
    });
  }
}
