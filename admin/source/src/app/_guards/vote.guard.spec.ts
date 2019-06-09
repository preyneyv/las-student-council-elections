import { TestBed, async, inject } from '@angular/core/testing';

import { VoteGuard } from './vote.guard';

describe('VoteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VoteGuard]
    });
  });

  it('should ...', inject([VoteGuard], (guard: VoteGuard) => {
    expect(guard).toBeTruthy();
  }));
});
