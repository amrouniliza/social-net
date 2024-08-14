 
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError, switchMap } from 'rxjs';
import { StorageService } from './storage.service';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000';

  AuthenticatedUser$  = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private storageService: StorageService) {}

  /**
   * Authenticates a user by sending a POST request to the login endpoint.
   *
   * @param {Object} credentials - An object containing the user's email and password.
   * @param {string} credentials.email - The user's email address.
   * @param {string} credentials.password - The user's password.
   * @return {Observable<User>} An observable that resolves to the authenticated user.
   */
  login(credentials: {email: string, password: string}): Observable<User> {
    return this.http.post<{message: string}>(`${this.apiUrl}/auth/login`, credentials, { withCredentials: true})
    .pipe(
      switchMap(() => this.getUserProfile()),
      catchError((err: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';
        if(err.error.statusCode === HttpStatusCode.NotFound) errorMessage = err.error.message;
        if(err.error.statusCode === HttpStatusCode.Unauthorized) errorMessage = 'Bad credentials'
          return throwError(() =>  new Error(errorMessage))
      })
    )
  }

  /**
   * Retrieves the user profile from the API.
   *
   * @return {Observable<User>} An observable that emits the user profile.
   */
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`, { withCredentials: true }).pipe(
      tap(
        user => {
          this.storageService.saveUser(user);
          this.AuthenticatedUser$.next(user)
        }
      ),
    )
  }

  /**
   * Registers a new user by sending a POST request to the registration endpoint.
   *
   * @param {User} user - The user object to be registered.
   * @return {Observable<User>} An observable that resolves to the registered user.
   */
  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/register`, user, { withCredentials: true }).pipe(
      tap(() => this.AuthenticatedUser$.next(user))
    )
  }
  
  /**
   * Logs out the currently authenticated user.
   *
   * @return {Observable<void>} An observable that resolves when the logout process is complete.
   */
  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true }).pipe(
      tap(() =>{
        this.storageService.clean();
        this.AuthenticatedUser$.next(null);
      })
    );
  }

  /**
   * Automatically logs in the user if they have a saved user profile.
   *
   * @return {void} No return value.
   */
  autoLogin(): void {
    const user = this.storageService.getSavedUser();
    if(user) {
      this.AuthenticatedUser$.next(user);
    }
  }

  isLoggedIn(): boolean {
    return !!this.AuthenticatedUser$.value;
  }
}
 