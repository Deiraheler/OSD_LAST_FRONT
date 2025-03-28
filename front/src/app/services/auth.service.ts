import { Injectable, signal, computed, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroment';
import { jwtDecode } from 'jwt-decode';
import { PLATFORM_ID } from '@angular/core';
import {Observable, of, tap} from "rxjs";
import {isPlatformBrowser} from "@angular/common";

export interface CustomJwtPayload {
  id: string;
  email: string;
  name: string;
  admin?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  // Use a signal to hold the current user payload (or null if not logged in)
  public userPayload = signal<CustomJwtPayload | null>(null);

  // A computed signal to check if the current user is an admin
  public isAdmin = computed(() => {
    const user = this.userPayload();
    return user ? !!user.admin : false;
  });

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.loadTokenPayload();
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/api/users/login`, { email, password }).pipe(
      tap((data) => {
        if (this.isBrowser()) {
          localStorage.setItem('token', data.token);
        }
        this.decodeToken(data.token);
      })
    );
  }

  register(email: string, name: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/api/users/register`, { email, name, password }).pipe(
      tap((data) => {
        if (this.isBrowser()) {
          localStorage.setItem('token', data.token);
        }
        this.decodeToken(data.token);
      })
    );
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
    this.userPayload.set(null);
  }

  private decodeToken(token: string) {
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      this.userPayload.set(decoded);
    } catch (error) {
      console.error('Error decoding token', error);
      this.userPayload.set(null);
    }
  }

  private loadTokenPayload() {
    if (this.isBrowser()) {
      const token = localStorage.getItem('token');
      if (token) {
        this.decodeToken(token);
      }
    }
  }

  isTokenValid(): Observable<boolean> {
    return of(!!this.userPayload());
  }

  private isBrowser(): boolean {
    // Only use localStorage in the browser.
    return typeof window !== 'undefined' && isPlatformBrowser(this.platformId);
  }
}
