import { TestBed } from '@angular/core/testing';

import { RBACUserService } from './user.service';

describe('RbacService', () => {
  let service: RBACUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RBACUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
