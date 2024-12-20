import { Injectable } from '@angular/core';
import Expense from "../interfaces/expense";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {environment} from "../../../enviroment";

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

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.loadExpenses();
  }

  toggleItemsStyle() {
    this.itemsStyleSubject.next(!this.itemsStyleSubject.value);
  }

  loadExpenses(page: number = 1, limit: number = this.limitSubject.value) {
    const url = `${this.apiUrl}/api/expenses?page=${page}&limit=${limit}&sortBy=${this.sortProperty}&sortOrder=${this.sortOrder}`;
    this.http.get<any>(url).subscribe((data) => {
      this.expensesSubject.next(data.expenses);
      this.totalItemsSubject.next(data.totalItems);
      this.currentPageSubject.next(data.currentPage);
    });
  }

  getAllCategories() {
    const url = `${this.apiUrl}/api/expenses/categories`;
    return this.http.get<string[]>(url);
  }

  setSort(property: keyof Expense, order: 'asc' | 'desc') {
    this.sortProperty = property;
    this.sortOrder = order;
    this.loadExpenses(this.currentPageSubject.value);
  }

  editExpense(expense: Expense) {
    this.http.put(`${this.apiUrl}/api/expenses/${expense._id}`, expense).subscribe((updatedExpense) => {
      this.loadExpenses(this.currentPageSubject.value);
    });
  }

  setLimit(limit: number) {
    this.limitSubject.next(limit);
    this.loadExpenses(this.currentPageSubject.value, limit); // Reload with updated limit
  }

  addExpense(expense: Expense) {
    this.http.post(`${this.apiUrl}/api/expenses`, expense).subscribe((data: any) => {
      this.loadExpenses(this.currentPageSubject.value, this.limitSubject.value);
    });
  }

  deleteExpense(expense: Expense) {
    this.http.delete(`${this.apiUrl}/api/expenses/${expense._id}`).subscribe((data: any) => {
      this.loadExpenses(this.currentPageSubject.value);
    });
  }
}
