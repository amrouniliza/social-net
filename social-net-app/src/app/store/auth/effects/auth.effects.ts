import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../../core/services/auth.service";
import { Router } from "@angular/router";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { loginFailure, AuthActionTypes, loadUser, loginSuccess, login, signUp, signUpSuccess, signUpFailure, initFailure, logout } from "../actions/auth.actions";
import { inject } from '@angular/core'


@Injectable()
export class AuthEffects {

    private actions$ = inject(Actions);
    private authService =  inject(AuthService);
    private router = inject(Router);

    init$ = createEffect(() => { return this.actions$.pipe(
        ofType(AuthActionTypes.INIT),
        switchMap(() => this.authService.getUserProfile()
            .pipe(
                map(user => loginSuccess({user})),
                catchError(() => {
                    this.router.navigate(['login']);
                    return of(initFailure())
                })
            )
        )
    )})

    login$ = createEffect(() => { return this.actions$.pipe(
        ofType(AuthActionTypes.LOGIN),
        switchMap((credentials: ReturnType<typeof login>) => 
            this.authService.login({email: credentials.email, password: credentials.password}).pipe(
                map(() => loadUser()),
                catchError((error) => of(loginFailure({ error })))
            )
        )
    )})


    loadUser$ = createEffect(() => { return this.actions$.pipe(
        ofType(AuthActionTypes.LOAD_USER),
        switchMap(() => this.authService.getUserProfile()
            .pipe(
                map(user => loginSuccess({ user })),
                catchError((error) => of(loginFailure({ error })))
            )
        )
    )})

    loginOrSignupSuccess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(
                AuthActionTypes.LOGIN_SUCCESS,
                AuthActionTypes.SIGNUP_SUCCESS
            ),
            tap(() => this.router.navigate(['home'])),
            
        )
    },
    { dispatch: false })

    signUp$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActionTypes.SIGNUP),
            switchMap((payload: ReturnType<typeof signUp>) => this.authService.register(payload.user)
                .pipe(
                    map((user) => signUpSuccess({user})),
                    catchError((error) => of(signUpFailure({ error })))
                )
            )
        )
    })

    refreshToken$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActionTypes.REFRESH_TOKEN),
            tap(() => this.authService.refreshToken()),
            catchError(() => of(logout()))
        )
    })

    logout$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActionTypes.LOGOUT),
            tap(() => this.authService.logout()),
            tap(() => this.router.navigate(['/login']))
        )
    },
    { dispatch: false })
}