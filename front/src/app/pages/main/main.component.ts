import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import Expense from "../../interfaces/expense";
import {ExpenseItemService} from "../../services/expense-item.service";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  expense: Expense = {} as Expense;

  constructor(private expenseService: ExpenseItemService) {}

  onSubmit = () => {
    this.expenseService.addExpense(this.expense);
  };
}
