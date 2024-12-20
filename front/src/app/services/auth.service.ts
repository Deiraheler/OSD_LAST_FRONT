import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../enviroment";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { isPlatformBrowser } from "@angular/common";

interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userPayloadSubject = new BehaviorSubject<CustomJwtPayload | null>(null);
  public userPayload$ = this.userPayloadSubject.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.loadTokenPayload();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/users/login`, { email, password }).pipe(
      tap((data) => {
        if (this.isBrowser()) {
          localStorage.setItem('token', data.token);
        }
        this.decodeToken(data.token);
      })
    );
  }

  register(email: string, name: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/users/register`, { email, name, password }).pipe(
      tap((data) => {
        if (this.isBrowser()) {
          localStorage.setItem('token', data.token);
        }
        this.decodeToken(data.token);
      })
    );
  }

  isTokenValid(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/api/auth/check-token`);
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
    this.userPayloadSubject.next(null); // Clear the user payload
  }

  private decodeToken(token: string) {
    try {
      const decodedPayload = jwtDecode<CustomJwtPayload>(token);
      this.userPayloadSubject.next(decodedPayload); // Update the observable
    } catch (error) {
      console.error('Error decoding token', error);
      this.userPayloadSubject.next(null);
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

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getUserPayload(): Observable<CustomJwtPayload | null> {
    return this.userPayload$;
  }
}
