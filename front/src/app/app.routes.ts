import { Routes } from '@angular/router';
import {MainComponent} from "./pages/main/main.component";
import {ExpensesComponent} from "./pages/expenses/expenses.component";
import {AuthComponent} from "./pages/auth/auth.component";
import {authGuard} from "./guards/auth.guard";
import {PasswordRecoveryComponent} from "./components/password-recovery/password-recovery.component";
import {PasswordRecoveryComponentPage} from "./pages/password-recovery/password-recovery.component";


export const routes: Routes = [
  {path: '', component: MainComponent, pathMatch: 'full', canActivate: [authGuard]},
  {path: 'auth', pathMatch: 'full',
  children: [
    {path: '', component: AuthComponent, pathMatch: 'full'},  //page for login
    //page for password recovery
    {path: 'recovery', component: PasswordRecoveryComponent},
  ]},
  {
    path: "reset-password",
    component: PasswordRecoveryComponentPage,
    pathMatch: "full"
  },
  {path: 'expenses', component: ExpensesComponent, pathMatch: 'full', canActivate: [authGuard]},
  {path: '**', redirectTo: ''}
];
