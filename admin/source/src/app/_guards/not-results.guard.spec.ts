import { TestBed, async, inject } from '@angular/core/testing';

import { NotResultsGuard } from './not-results.guard';

describe('NotResultsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotResultsGuard]
    });
  });

  it('should ...', inject([NotResultsGuard], (guard: NotResultsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
