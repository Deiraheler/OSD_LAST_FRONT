import { Routes } from '@angular/router';
import {MainComponent} from "./pages/main/main.component";
import {ExpensesComponent} from "./pages/expenses/expenses.component";
import {AuthComponent} from "./pages/auth/auth.component";
import {authGuard} from "./guards/auth.guard";


export const routes: Routes = [
  {path: '', component: MainComponent, pathMatch: 'full', canActivate: [authGuard]},
  {path: 'auth', component: AuthComponent, pathMatch: 'full'},
  {path: 'expenses', component: ExpensesComponent, pathMatch: 'full', canActivate: [authGuard]},
  {path: '**', redirectTo: ''}
];
