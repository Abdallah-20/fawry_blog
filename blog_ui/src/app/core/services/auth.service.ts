import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode'; 


@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/users';

  // Signal to hold the user state
  currentUser = signal<User | null>(null);

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/authenticate`, credentials, {responseType: "text"}).pipe(
      tap((token: any) => {
        if (token) {
          localStorage.setItem('access_token', token);
        }
      }),
      catchError((err) => {
        // Handle global login errors here
        return throwError(() => new Error(err.error.message || 'Login failed'));
      }),
    );
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  getUserName(): string {
    const token = localStorage.getItem('access_token');
    if (!token) return 'Guest';

    try {
      const decoded: any = jwtDecode(token);
      return decoded.sub || 'User'; // Adjust 'name' based on your Mockoon/JWT payload
    } catch {
      return 'User';
    }
  }

  register(userData: any) {
    return this.http.post<User>(`${this.API_URL}/auth/register`, userData).pipe(
      tap((user) => {
        // After registration, we usually log them in automatically
        this.currentUser.set(user);
        localStorage.setItem('blog_token', user.token);
      }),
    );
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('blog_token');
  }
}
