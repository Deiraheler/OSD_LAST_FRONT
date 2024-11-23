import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import Expense from "../../interfaces/expense";
import {ExpenseItemService} from "../../services/expense-item.service";

@Component({
  selector: 'app-expense-item',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './expense-item.component.html',
  styleUrl: './expense-item.component.css'
})
export class ExpenseItemComponent {
  public editMode = false;
  public deleteMode = false;
  public itemsStyle: boolean = false;
  @HostBinding('class.alternate-style') applyAlternateStyle = false;

  @Input() expense!: Expense;
  public message!: string;

  @Output() highlight = new EventEmitter<void>();

  constructor(private expenseItemService: ExpenseItemService) {
    this.message = 'Are you sure you want to delete this expense?';

    this.expenseItemService.itemsStyle$.subscribe((itemsStyle) => {
      this.itemsStyle = itemsStyle;
      this.applyAlternateStyle = itemsStyle;
    });
  }

  openEdit() {
    this.editMode = true;
  }

  openDelete() {
    this.deleteMode = true;
  }

  closeDelete() {
    this.deleteMode = false;
  }

  deleteExpense() {
    if (this.expense) {
      this.expenseItemService.deleteExpense(this.expense);
    }
  }

  saveExpense() {
    if (this.expense) {
      this.expenseItemService.editExpense(this.expense);
      this.highlight.emit();
      this.editMode = false;
    }
  }
}
