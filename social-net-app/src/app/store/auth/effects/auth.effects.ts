import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import {
  AuthActionTypes,
  loadUser,
  login,
  signUp,
  initFailure,
  logout,
  authFailure,
  authSuccess,
} from '../actions/auth.actions';
import { inject } from '@angular/core';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActionTypes.INIT),
      switchMap(() =>
        this.authService.getUserProfile().pipe(
          map((user) => authSuccess({ user })),
          catchError(() => {
            this.router.navigate(['login']);
            return of(initFailure());
          }),
        ),
      ),
    );
  });

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActionTypes.LOGIN),
      switchMap((credentials: ReturnType<typeof login>) =>
        this.authService
          .login({ email: credentials.email, password: credentials.password })
          .pipe(
            map(() => loadUser()),
            catchError((error) => of(authFailure({ error }))),
          ),
      ),
    );
  });

  loadUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActionTypes.LOAD_USER),
      switchMap(() =>
        this.authService.getUserProfile().pipe(
          map((user) => authSuccess({ user })),
          catchError((error) => of(authFailure({ error }))),
        ),
      ),
    );
  });

  authSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActionTypes.AUTH_SUCCESS),
        // tap(() => this.router.navigate(['home'])),
        tap(() => console.log('auth success')),
      );
    },
    { dispatch: false },
  );

  signUp$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActionTypes.SIGNUP),
      switchMap((payload: ReturnType<typeof signUp>) =>
        this.authService.register(payload.user).pipe(
          map(() => loadUser()),
          catchError((error) => of(authFailure({ error }))),
        ),
      ),
    );
  });

  refreshToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActionTypes.REFRESH_TOKEN),
      tap(() => this.authService.refreshToken()),
      catchError(() => of(logout())),
    );
  });

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActionTypes.LOGOUT),
        switchMap(() =>
          this.authService
            .logout()
            .pipe(map(() => this.router.navigate(['/login']))),
        ),
      );
    },
    { dispatch: false },
  );
}
