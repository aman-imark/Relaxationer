import { TestBed } from '@angular/core/testing';

import { HttpCapService } from './http-cap.service';

describe('HttpCapService', () => {
  let service: HttpCapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpCapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
