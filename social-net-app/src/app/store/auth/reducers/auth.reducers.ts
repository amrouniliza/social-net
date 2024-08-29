import { createReducer, on } from '@ngrx/store';
import { User } from '../../../models';
import {
  authFailure,
  authSuccess,
  initFailure,
  logout,
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
    authSuccess,
    (state, { user }): AuthState => ({
      ...state,
      isAuthenticated: true,
      user: user,
      errorMessage: null,
    }),
  ),
  on(
    authFailure,
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
