import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, concatMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  
  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse) {
        switch(error.status) {
          case HttpStatusCode.Unauthorized:
            return authService.getRefreshToken().pipe(
              concatMap(() => next(req)),
              catchError(err => {
                if (err.status === HttpStatusCode.Forbidden) {
                  authService.logout();
                }
                return throwError(() => err)
              })
            )
          case HttpStatusCode.Forbidden:
            router.navigate(['/forbidden']);
        }
      }
      return throwError(() => error);
    })
  )
};
