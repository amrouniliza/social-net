import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { Credentials, User } from '../../models';
import { Store } from '@ngrx/store';
import { login, signUp } from '../../store/auth/actions/auth.actions';
import { selectError } from '../../store/auth/selectors/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MatTabsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  registerForm: FormGroup;
  errorMessage$!: Observable<string | null>;
  isLogged$!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.errorMessage$ = this.store.select(selectError);
  }

  ngOnInit() {
    this.isLogged$ = this.authService.isLogged.subscribe({
      next: (isLogged) => {
        if (isLogged) {
          this.router.navigate(['home']);
        }
      },
    });
  }

  login() {
    const credentials: Credentials = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };
    this.store.dispatch(login(credentials));
  }

  register() {
    const user: User = {
      username: this.registerForm.get('username')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
    };

    if (this.registerForm.valid) {
      this.store.dispatch(signUp({ user }));
    }
  }

  ngOnDestroy() {
    this.isLogged$.unsubscribe();
  }
}
