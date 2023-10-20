import { TestBed } from '@angular/core/testing';

import { OpenRouteService } from './openrouteservice.service';

describe('OpenrouteserviceService', () => {
  let service: OpenRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
