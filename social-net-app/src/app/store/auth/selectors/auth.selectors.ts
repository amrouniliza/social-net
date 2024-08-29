import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../reducers/auth.reducers';
import { User } from '../../../models';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState): User | null => state.user,
);

export const selectUserIsLogged = createSelector(
  selectAuthState,
  (state: AuthState): boolean => state.isAuthenticated,
);

export const selectError = createSelector(
  selectAuthState,
  (state: AuthState): string | null => state.errorMessage,
);
