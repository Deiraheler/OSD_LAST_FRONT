import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Expense from '../interfaces/expense';
import { environment } from '../../../enviroment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseItemService {
  // Signals to store state
  public expenses = signal<Expense[]>([]);
  public totalItems = signal<number>(0);
  public currentPage = signal<number>(1);
  public limit = signal<number>(9);
  public itemsStyle = signal<boolean>(false);
  public highlightedItemId = signal<string | null>(null);

  private sortProperty: keyof Expense = 'date';
  private sortOrder: 'asc' | 'desc' = 'asc';

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.loadExpenses();
  }

  toggleItemsStyle() {
    this.itemsStyle.update(value => !value);
  }

  loadExpenses(page: number = 1, limit: number = this.limit()) {
    const url = `${this.apiUrl}/api/expenses?page=${page}&limit=${limit}&sortBy=${this.sortProperty}&sortOrder=${this.sortOrder}`;
    this.http.get<any>(url).subscribe((data) => {
      this.expenses.set(data.expenses);
      this.totalItems.set(data.totalItems);
      this.currentPage.set(data.currentPage);
    });
  }

  getAllCategories() {
    const url = `${this.apiUrl}/api/expenses/categories`;
    return this.http.get<string[]>(url);
  }

  setSort(property: keyof Expense, order: 'asc' | 'desc') {
    this.sortProperty = property;
    this.sortOrder = order;
    this.loadExpenses(this.currentPage(), this.limit());
  }

  editExpense(expense: Expense) {
    this.http.put(`${this.apiUrl}/api/expenses/${expense._id}`, expense).subscribe(() => {
      this.loadExpenses(this.currentPage(), this.limit());
    });
  }

  setLimit(limit: number) {
    this.limit.set(limit);
    this.loadExpenses(this.currentPage(), limit);
  }

  addExpense(expense: Expense) {
    this.http.post(`${this.apiUrl}/api/expenses`, expense).subscribe(() => {
      this.loadExpenses(this.currentPage(), this.limit());
    });
  }

  deleteExpense(expense: Expense) {
    this.http.delete(`${this.apiUrl}/api/expenses/${expense._id}`).subscribe(() => {
      this.loadExpenses(this.currentPage());
    });
  }
}
