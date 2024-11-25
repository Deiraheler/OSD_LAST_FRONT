import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import Expense from "../../interfaces/expense";
import {ExpenseItemService} from "../../services/expense-item.service";
import {CategoryOptionsComponent} from "../../components/category-options/category-options.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    FormsModule,
    CategoryOptionsComponent,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  expense: Expense = {} as Expense;
  private expenseForm: FormGroup<{
    date: FormControl<string | null>;
    amount: FormControl<number | string | null>;
    description: FormControl<string | null>;
    category: FormControl<string | null>
  }>;

  constructor(private expenseService: ExpenseItemService) {
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

  onSubmit = () => {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    this.expenseService.addExpense(this.expense);
    this.expense = {} as Expense;
  };

  onCategorySelected(category: string): void {
    this.expense.category = category;
  }
}
