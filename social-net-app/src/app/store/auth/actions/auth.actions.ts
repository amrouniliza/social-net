import { createAction, props } from '@ngrx/store';
import { HttpError, User } from '../../../models';

export enum AuthActionTypes {
  INIT = '[App] Init',
  INIT_FAILURE = '[App] Init Failure',
  LOGIN = '[Auth] Login',
  LOAD_USER = '[Auth] Load User',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAILURE = '[Auth] Login Failure',
  SIGNUP = '[Auth] Signup',
  SIGNUP_SUCCESS = '[Auth] Signup Success',
  SIGNUP_FAILURE = '[Auth] Signup Failure',
  REFRESH_TOKEN = '[Auth] Refresh Token',
  LOGOUT = '[Auth] Logout',
  GET_STATUS = '[Auth] GetStatus',
}

export const init = createAction(AuthActionTypes.INIT);

export const initFailure = createAction(AuthActionTypes.INIT_FAILURE);

export const login = createAction(
  AuthActionTypes.LOGIN,
  props<{ email: string; password: string }>(),
);

export const loadUser = createAction(AuthActionTypes.LOAD_USER);

export const loginSuccess = createAction(
  AuthActionTypes.LOGIN_SUCCESS,
  props<{ user: User }>(),
);

export const loginFailure = createAction(
  AuthActionTypes.LOGIN_FAILURE,
  props<{ error: HttpError }>(),
);

export const signUp = createAction(
  AuthActionTypes.SIGNUP,
  props<{ user: User }>(),
);

export const signUpSuccess = createAction(
  AuthActionTypes.SIGNUP_SUCCESS,
  props<{ user: User }>(),
);

export const signUpFailure = createAction(
  AuthActionTypes.SIGNUP_FAILURE,
  props<{ error: HttpError }>(),
);

export const refreshToken = createAction(AuthActionTypes.REFRESH_TOKEN);

export const logout = createAction(AuthActionTypes.LOGOUT);

export const getStatus = createAction(AuthActionTypes.GET_STATUS);
