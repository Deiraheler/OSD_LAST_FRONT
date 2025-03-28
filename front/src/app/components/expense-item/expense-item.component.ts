import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Expense from '../../interfaces/expense';
import { ExpenseItemService } from '../../services/expense-item.service';
import { CategoryOptionsComponent } from '../category-options/category-options.component';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-expense-item',
  standalone: true,
  imports: [
    CategoryOptionsComponent,
    DatePipe,
    ReactiveFormsModule,
    NgIf,
    FormsModule,
    NgClass
  ],
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.css']
})
export class ExpenseItemComponent {
  public editMode = false;
  public deleteMode = false;

  get highlightedItemId(): string | null {
    return this.expenseStore.highlightedItemId();
  }

  // Use a HostBinding getter to apply alternate style based on the store's signal.
  @HostBinding('class.alternate-style')
  get applyAlternateStyle() {
    return this.expenseStore.itemsStyle();
  }

  @Input() expense!: {
    date: string;
    amount: number;
    description: string;
    _id: string;
    category: string;
    status: string
  };
  public message!: string;
  @Output() highlight = new EventEmitter<void>();
  public expenseForm!: FormGroup;

  constructor(
    private expenseStore: ExpenseItemService, // Use the new store
    public authService: AuthService // AuthService now uses Signals
  ) {
    this.message = 'Are you sure you want to delete this expense?';
    // We no longer subscribe to itemsStyle$—we use the signal directly in the getter above.
  }

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.expenseForm = new FormGroup({
      category: new FormControl(this.expense?.category || '', [
        Validators.required,
        Validators.minLength(3),
      ]),
      description: new FormControl(this.expense?.description || '', [
        Validators.required,
        Validators.minLength(3),
      ]),
      amount: new FormControl(this.expense?.amount || '', [
        Validators.required,
        Validators.min(1),
      ]),
      date: new FormControl(this.expense?.date || '', Validators.required),
    });
  }

  get category(): FormControl {
    const control = this.expenseForm.get('category');
    if (!control) {
      throw new Error('Category control is not found');
    }
    return control as FormControl;
  }

  get description(): FormControl {
    const control = this.expenseForm.get('description');
    if (!control) {
      throw new Error('Description control is not found');
    }
    return control as FormControl;
  }

  get amount(): FormControl {
    const control = this.expenseForm.get('amount');
    if (!control) {
      throw new Error('Amount control is not found');
    }
    return control as FormControl;
  }

  get date(): FormControl {
    const control = this.expenseForm.get('date');
    if (!control) {
      throw new Error('Date control is not found');
    }
    return control as FormControl;
  }

  openEdit() {
    this.editMode = true;
    if (this.expense.date) {
      this.expenseForm.patchValue({
        date: new Date(this.expense.date).toISOString().split('T')[0],
      });
    }
  }

  openDelete() {
    this.deleteMode = true;
  }

  closeDelete() {
    this.deleteMode = false;
  }

  deleteExpense() {
    if (this.expense) {
      // Use the store's deletion method (assume you have updated your ExpenseStoreService accordingly)
      this.expenseStore.deleteExpense(<Expense>this.expense);
    }
  }

  onCategorySelected(category: string): void {
    this.expenseForm.patchValue({ category });
  }

  saveExpense() {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }
    const updatedExpense = {
      ...this.expense,
      ...this.expenseForm.value,
      date: new Date(this.expenseForm.value.date).toISOString(),
    };
    // Use the store's editExpense method to update the expense
    this.expenseStore.editExpense(updatedExpense);
    this.highlight.emit();
    this.editMode = false;
  }

  // New method for admin actions to update the expense status
  updateStatus(expenseId: string, status: "approved" | "rejected"): void {
    const updatedExpense: Expense = { ...this.expense, status };
    this.expenseStore.editExpense(updatedExpense);
  }
}
