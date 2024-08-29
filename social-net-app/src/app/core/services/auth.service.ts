import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, switchMap, of } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { User } from '../../models';
import { Store } from '@ngrx/store';
import { selectUserIsLogged } from '../../store/auth/selectors/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000';

  AuthenticatedUser$ = new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private store: Store,
  ) {}

  /**
   * Authenticates a user by sending a POST request to the login endpoint.
   *
   * @param {Object} credentials - An object containing the user's email and password.
   * @param {string} credentials.email - The user's email address.
   * @param {string} credentials.password - The user's password.
   * @return {Observable<User>} An observable that resolves to the authenticated user.
   */
  login(credentials: {
    email: string;
    password: string;
  }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/auth/login`,
      credentials,
      { withCredentials: true },
    );
  }

  /**
   * Refreshes the user's access token by sending a GET request to the refresh endpoint.
   *
   * @return {Observable<{message: string}>} An observable that resolves to an object containing a message.
   */
  refreshToken(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.apiUrl}/auth/refresh`, {
      withCredentials: true,
    });
  }

  /**
   * Retrieves the user profile from the API.
   *
   * @return {Observable<User>} An observable that emits the user profile.
   */
  getUserProfile(): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/auth/me`, { withCredentials: true })
      .pipe(
        tap((user) => console.log(user)),
        switchMap((user) => {
          this.storageService.saveUser(user);
          return of(user);
        }),
      );
  }

  /**
   * Registers a new user by sending a POST request to the registration endpoint.
   *
   * @param {User} user - The user object to be registered.
   * @return {Observable<User>} An observable that resolves to the registered user.
   */
  register(user: User): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/auth/register`, user, {
        withCredentials: true,
      })
      .pipe(tap(() => this.AuthenticatedUser$.next(user)));
  }

  /**
   * Logs out the currently authenticated user.
   *
   * @return {Observable<void>} An observable that resolves when the logout process is complete.
   */
  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.storageService.clean();
          this.AuthenticatedUser$.next(null);
        }),
      );
  }

  /**
   * Returns an observable that emits a boolean indicating whether the user is logged in or not.
   * If the user is not logged in, the observable emits undefined or false.
   *
   * @return {Observable<boolean | undefined>} An observable that emits a boolean indicating whether the user is logged in or not.
   */
  get isLogged(): Observable<boolean | undefined> {
    return this.store.select(selectUserIsLogged);
  }
}
