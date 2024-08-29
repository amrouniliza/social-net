import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, retry, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpError } from '../../models';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  let isRefreshing = false;

  return next(req).pipe(
    retry(0),
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        !req.url.includes('auth/refresh')
      ) {
        const HttpError: HttpError = {
          statusCode: error.error.statusCode,
          message: error.error.message,
        };
        switch (error.status) {
          case HttpStatusCode.Unauthorized:
            if (!isRefreshing) {
              isRefreshing = true;

              return authService.refreshToken().pipe(
                retry(0),
                switchMap(() => {
                  isRefreshing = false;

                  return next(req);
                }),
                catchError((error) => {
                  isRefreshing = false;

                  if (error.status == 403) {
                    authService.logout();
                    router.navigate(['/login']);
                  }

                  return throwError(() => error);
                }),
              );
            }
            return next(req);

          case HttpStatusCode.Forbidden:
            router.navigate(['/forbidden']);
        }
        return throwError(() => HttpError);
      }
      return throwError(() => error);
    }),
  );
};
