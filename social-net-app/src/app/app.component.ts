import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { Store } from '@ngrx/store';
import { init } from './store/auth/actions/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'social-net-app';
  isLoggedin = false;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(init());
  }
}
