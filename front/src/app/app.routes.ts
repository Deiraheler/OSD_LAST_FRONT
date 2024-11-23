import { Routes } from '@angular/router';
import {MainComponent} from "./pages/main/main.component";
import {ExpensesComponent} from "./pages/expenses/expenses.component";


export const routes: Routes = [
  {path: '', component: MainComponent, pathMatch: 'full'},
  {path: 'expenses', component: ExpensesComponent, pathMatch: 'full'}
];
