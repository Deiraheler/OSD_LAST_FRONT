import { Routes } from '@angular/router';
import {MainComponent} from "./pages/main/main.component";
import {ExpensesComponent} from "./pages/expenses/expenses.component";
import {AuthComponent} from "./pages/auth/auth.component";
import {authGuard} from "./guards/auth.guard";
import {PasswordRecoveryComponent} from "./components/password-recovery/password-recovery.component";
import {PasswordRecoveryComponentPage} from "./pages/password-recovery/password-recovery.component";


export const routes: Routes = [
  {path: '', component: MainComponent, pathMatch: 'full', canActivate: [authGuard]},
  {path: 'auth', pathMatch: 'full', component: AuthComponent},
  {path: 'recovery', component: PasswordRecoveryComponent, pathMatch: 'full'},
  {
    path: "reset-password",
    component: PasswordRecoveryComponentPage,
    pathMatch: "full"
  },
  {path: 'expenses', component: ExpensesComponent, pathMatch: 'full', canActivate: [authGuard]},
  {path: '**', redirectTo: ''}
];
