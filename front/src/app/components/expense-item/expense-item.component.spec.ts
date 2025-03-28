import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseItemComponent } from './expense-item.component';
import {AuthService} from "../../services/auth.service";
import {ExpenseItemService} from "../../services/expense-item.service";
import {By} from "@angular/platform-browser";

class ExpenseItemServiceStub {
  itemsStyle = () => false;
  highlightedItemId = () => null;
  editExpense = jasmine.createSpy('editExpense');
  deleteExpense = jasmine.createSpy('deleteExpense');
}

// Minimal stub for AuthService where isAdmin returns true
class AuthServiceStub {
  isAdmin = () => true;
}

// Dummy expense data
const dummyExpense = {
  _id: '1',
  description: 'I bought bread 23 times already',
  category: 'Food',
  amount: 10,
  date: new Date().toISOString(),
  status: 'pending'
};

fdescribe('ExpenseItemComponent', () => {
  let component: ExpenseItemComponent;
  let fixture: ComponentFixture<ExpenseItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseItemComponent],
      providers: [
        { provide: ExpenseItemService, useClass: ExpenseItemServiceStub },
        { provide: AuthService, useClass: AuthServiceStub }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseItemComponent);
    component = fixture.componentInstance;
    component.expense = dummyExpense;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display admin controls', () => {
    const adminControls = fixture.debugElement.query(By.css('.admin-controls'));
    expect(adminControls).toBeTruthy();
  });

  it('should call updateStatus with "approved" when Approve button is clicked', () => {
    spyOn(component as any, 'updateStatus');
    const approveBtn = fixture.debugElement.query(By.css('.admin-controls .btn.btn-success'));
    approveBtn.triggerEventHandler('click', null);
    expect(component.updateStatus).toHaveBeenCalledWith(dummyExpense._id, 'approved');
  });
});
