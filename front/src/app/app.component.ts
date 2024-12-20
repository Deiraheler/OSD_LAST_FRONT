import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ExpenseItemService} from "./services/expense-item.service";
import {AuthService} from "./services/auth.service";
import {AsyncPipe, NgIf} from "@angular/common";
import { Router} from "@angular/router";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterLink, NgIf, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front';
  user$: Observable<any>;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.userPayload$; // Subscribe to user state
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
