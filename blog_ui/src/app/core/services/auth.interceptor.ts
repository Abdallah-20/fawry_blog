// auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

const excludedUrls = ["/authenticate"];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // Get token from localStorage
  const token = localStorage.getItem('access_token');
  
  // Clone request and add authorization header if token exists
  let authReq = req;
  console.log(req);
  if (!excludedUrls.includes(req.url) && token) {
    authReq = req.clone({
      setHeaders: {
        "Authorization": `Bearer ${token}`,
      }
    });
  }
  
  // Handle the request and catch errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};