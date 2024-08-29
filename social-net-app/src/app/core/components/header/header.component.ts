import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../models';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import {
  selectUser,
  selectUserIsLogged,
} from '../../../store/auth/selectors/auth.selectors';
import { CommonModule } from '@angular/common';
import { logout } from '../../../store/auth/actions/auth.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  user$!: Observable<User | null>;
  isAuthenticated$!: Observable<boolean>;

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
    this.isAuthenticated$ = this.store.select(selectUserIsLogged);
  }

  logout() {
    this.store.dispatch(logout());
  }
}
