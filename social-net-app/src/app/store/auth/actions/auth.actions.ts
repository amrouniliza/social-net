import { createAction, props } from '@ngrx/store';
import { HttpError, User } from '../../../models';

export enum AuthActionTypes {
  INIT = '[App] Init',
  INIT_FAILURE = '[App] Init Failure',
  LOGIN = '[Auth] Login',
  SIGNUP = '[Auth] Signup',
  LOAD_USER = '[Auth] Load User',
  AUTH_SUCCESS = '[Auth] Auth Success',
  AUTH_FAILURE = '[Auth] Auth Failure',
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

export const authSuccess = createAction(
  AuthActionTypes.AUTH_SUCCESS,
  props<{ user: User }>(),
);

export const authFailure = createAction(
  AuthActionTypes.AUTH_FAILURE,
  props<{ error: HttpError }>(),
);

export const signUp = createAction(
  AuthActionTypes.SIGNUP,
  props<{ user: User }>(),
);

export const refreshToken = createAction(AuthActionTypes.REFRESH_TOKEN);

export const logout = createAction(AuthActionTypes.LOGOUT);

export const getStatus = createAction(AuthActionTypes.GET_STATUS);
