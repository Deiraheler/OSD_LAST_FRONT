import {Component, HostBinding} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import Expense from "../../interfaces/expense";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ExpenseItemComponent} from "../../components/expense-item/expense-item.component";
import {ExpenseItemService} from "../../services/expense-item.service";

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
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent {
  public expenses: Expense[] = [];
  public itemsStyle: boolean = false;

  public sortProperty: keyof Expense | null = null;
  public sortOrder: 'asc' | 'desc' = 'asc';

  public highlightedItemId: string | null = null;

  public currentPage: number = 1;
  public totalItems: number = 0;
  public itemsPerPage: number = 10;
  public itemsPerPageOptions: number[] = [5, 10, 25, 100];

  //Mobile dropdown status
  public mobileDropdown = false;

  constructor(private expenseService: ExpenseItemService) {
    this.expenseService.expenses$.subscribe((expenses) => {
      this.expenses = expenses;

      if (this.highlightedItemId) {
        setTimeout(() => {
          this.highlightedItemId = null;
        }, 2000);
      }

      this.sortExpenses();
    });

    this.expenseService.totalItems$.subscribe((total) => {
      this.totalItems = total;
    });

    this.expenseService.limit$.subscribe((limit) => {
      this.itemsPerPage = limit;
    });

    this.expenseService.currentPage$.subscribe((page) => {
      this.currentPage = page;
    });

    this.expenseService.itemsStyle$.subscribe((itemsStyle) => {
      this.itemsStyle = itemsStyle;
    });

    this.loadExpenses();
  };

  changeItemsStyle() {
    this.expenseService.toggleItemsStyle();
  }

  toggleSort(property: keyof Expense) {
    if (this.sortProperty === property) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortProperty = property;
      this.sortOrder = 'asc';
    }
    this.expenseService.setSort(this.sortProperty, this.sortOrder);
  }

  sortExpenses() {
    if (!this.sortProperty) return;
    this.expenses.sort((a, b) => {
      if (a[this.sortProperty!] < b[this.sortProperty!]) {
        return this.sortOrder === 'asc' ? -1 : 1;
      } else if (a[this.sortProperty!] > b[this.sortProperty!]) {
        return this.sortOrder === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  highlightItem(itemId: string) {
    this.highlightedItemId = itemId;
  }

  loadExpenses(page: number = 1) {
    this.expenseService.loadExpenses(page, this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getPaginationRange(): number[] {
    const totalPages = this.totalPages;
    const range: number[] = [];

    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(totalPages, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  }

  changeItemsPerPage($event: Event): void {
    const target = $event.target as HTMLSelectElement;
    const newLimit = parseInt(target.value, 10);

    if (newLimit !== this.itemsPerPage) {
      this.expenseService.setLimit(newLimit);
    }
  }

  toggleMobileDropdown() {
    this.mobileDropdown = !this.mobileDropdown;
  }
}
