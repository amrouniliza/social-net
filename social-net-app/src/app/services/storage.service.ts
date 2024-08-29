import { Injectable } from '@angular/core';
import { User } from '../models';

const USER_KEY = 'authenticated-user';

@Injectable({
  providedIn: 'root',
})

// TODO use store ngRX instead of localstorage
export class StorageService {
  saveUser(user: User) {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  getSavedUser(): User | null {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  clean(): void {
    localStorage.clear();
  }
}
