import { createReducer, on } from '@ngrx/store';
import { User } from '../../../models';
import {
  initFailure,
  loginFailure,
  loginSuccess,
  logout,
  signUpFailure,
  signUpSuccess,
} from '../actions/auth.actions';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  errorMessage: string | null;
}

export const initialUserState: AuthState = {
  isAuthenticated: false,
  user: null,
  errorMessage: null,
};

export const authReducer = createReducer(
  initialUserState,
  on(
    initFailure,
    (state): AuthState => ({
      ...state,
      ...initialUserState,
    }),
  ),
  on(
    loginSuccess,
    (state, { user }): AuthState => ({
      ...state,
      isAuthenticated: true,
      user: user,
      errorMessage: null,
    }),
  ),
  on(
    loginFailure,
    (state, { error }): AuthState => ({
      ...state,
      errorMessage: error.message,
    }),
  ),
  on(
    signUpSuccess,
    (state, { user }): AuthState => ({
      ...state,
      isAuthenticated: true,
      user: user,
      errorMessage: null,
    }),
  ),
  on(
    signUpFailure,
    (state, { error }): AuthState => ({
      ...state,
      errorMessage: error.message,
    }),
  ),
  on(
    logout,
    (state): AuthState => ({
      ...state,
      ...initialUserState,
    }),
  ),
);
