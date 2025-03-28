import {Component, WritableSignal} from '@angular/core';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseItemComponent } from '../../components/expense-item/expense-item.component';
import { ExpenseItemService } from '../../services/expense-item.service';
import Expense from "../../interfaces/expense";

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgIf,
    FormsModule,
    ExpenseItemComponent,
    NgClass
  ],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent {
  expenses = this.expenseStore.expenses;
  totalItems = this.expenseStore.totalItems;
  currentPage = this.expenseStore.currentPage;
  limit = this.expenseStore.limit;
  itemsStyle = this.expenseStore.itemsStyle;
  highlightedItemId: WritableSignal<string | null> = this.expenseStore.highlightedItemId;

  public sortProperty: keyof Expense | null = null;
  public sortOrder: 'asc' | 'desc' = 'asc';
  public itemsPerPageOptions: number[] = [5, 10, 25, 100];
  public mobileDropdown = false;

  constructor(private expenseStore: ExpenseItemService) {
    this.loadExpenses();
  }

  changeItemsStyle() {
    this.expenseStore.toggleItemsStyle();
  }

  toggleSort(property: keyof Expense) {
    if (this.sortProperty === property) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortProperty = property;
      this.sortOrder = 'asc';
    }
    this.expenseStore.setSort(this.sortProperty, this.sortOrder);
  }

  highlightItem(itemId: string) {
    this.highlightedItemId.set(itemId);
    setTimeout(() => {
      this.highlightedItemId.set(null);
    }, 2000);
  }

  loadExpenses(page: number = 1) {
    // Use the current value of limit by calling this.limit() as a function
    this.expenseStore.loadExpenses(page, this.limit());
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems() / this.limit());
  }

  getPaginationRange(): number[] {
    const totalPages = this.totalPages;
    const range: number[] = [];
    const start = Math.max(1, this.currentPage() - 2);
    const end = Math.min(totalPages, this.currentPage() + 2);
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }

  changeItemsPerPage($event: Event): void {
    const target = $event.target as HTMLSelectElement;
    const newLimit = parseInt(target.value, 10);
    if (newLimit !== this.limit()) {
      this.expenseStore.setLimit(newLimit);
    }
  }

  toggleMobileDropdown() {
    this.mobileDropdown = !this.mobileDropdown;
  }
}
