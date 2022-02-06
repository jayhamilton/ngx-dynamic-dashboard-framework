import { TestBed } from '@angular/core/testing';

import { ImageUploadService } from './file-upload.service';

describe('ImageUploadService', () => {
  let service: ImageUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
