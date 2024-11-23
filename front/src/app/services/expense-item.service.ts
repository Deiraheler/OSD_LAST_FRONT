import { Injectable } from '@angular/core';
import Expense from "../interfaces/expense";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExpenseItemService {

  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  public expenses$ = this.expensesSubject.asObservable();

  private totalItemsSubject = new BehaviorSubject<number>(0);
  public totalItems$ = this.totalItemsSubject.asObservable();

  private currentPageSubject = new BehaviorSubject<number>(1);
  public currentPage$ = this.currentPageSubject.asObservable();

  private limitSubject = new BehaviorSubject<number>(9);
  public limit$ = this.limitSubject.asObservable();

  private itemsStyleSubject = new BehaviorSubject<boolean>(false);
  public itemsStyle$ = this.itemsStyleSubject.asObservable();

  private sortProperty: keyof Expense = 'date';
  private sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private http: HttpClient) {
    this.loadExpenses();
  }

  toggleItemsStyle() {
    this.itemsStyleSubject.next(!this.itemsStyleSubject.value);
  }

  loadExpenses(page: number = 1, limit: number = this.limitSubject.value) {
    const url = `http://localhost:3000/expenses?page=${page}&limit=${limit}&sortBy=${this.sortProperty}&sortOrder=${this.sortOrder}`;
    this.http.get<any>(url).subscribe((data) => {
      this.expensesSubject.next(data.expenses);
      this.totalItemsSubject.next(data.totalItems);
      this.currentPageSubject.next(data.currentPage);
    });
  }

  setSort(property: keyof Expense, order: 'asc' | 'desc') {
    this.sortProperty = property;
    this.sortOrder = order;
    this.loadExpenses(this.currentPageSubject.value);
  }

  editExpense(expense: Expense) {
    this.http.put(`http://localhost:3000/expenses/${expense._id}`, expense).subscribe((updatedExpense) => {
      this.loadExpenses(this.currentPageSubject.value);
    });
  }

  addExpense(expense: Expense) {
    this.http.post('http://localhost:3000/expenses', expense).subscribe((data: any) => {
      const currentExpenses = this.expensesSubject.value;
      this.expensesSubject.next([...currentExpenses, data]);
    });
  }

  deleteExpense(expense: Expense) {
    this.http.delete(`http://localhost:3000/expenses/${expense._id}`).subscribe((data: any) => {
      const currentExpenses = this.expensesSubject.value;
      const updatedExpenses = currentExpenses.filter((e) => e._id !== expense._id);
      this.expensesSubject.next(updatedExpenses);
    });
  }
}
