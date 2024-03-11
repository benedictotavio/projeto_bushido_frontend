import { TestBed } from '@angular/core/testing';

import { ServiceLoadingService } from './service-loading.service';

describe('ServiceLoadingService', () => {
  let service: ServiceLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceLoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
