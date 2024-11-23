import { TestBed } from '@angular/core/testing';

import { ExpenseItemService } from './expense-item.service';

describe('ExpenseItemService', () => {
  let service: ExpenseItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
