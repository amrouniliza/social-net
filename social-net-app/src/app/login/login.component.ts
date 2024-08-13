import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { User } from '../models';

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
    MatTabsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy{

  loginForm: FormGroup;
  registerForm: FormGroup;
  errorMessage! : string;
  AuthUserSub! : Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.AuthUserSub = this.authService.AuthenticatedUser$.subscribe({
      next : user => {
        if(user) {
          this.router.navigate(['home']);
        }
      }
    })
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['home']);
      },
      error : (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  register() {
    console.log('register');
    const user: User = {
      username: this.registerForm.get('username')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value
    };
    // parse register form values as user object

    if(this.registerForm.valid) {
      this.authService.register(user).subscribe({
        next: () => {
          this.router.navigate(['home']);
        },
        error : (err) => {
          console.log(err);
          this.errorMessage = err.message;
        }
      });  
    }
  }

  ngOnDestroy() {
    this.AuthUserSub.unsubscribe();
  }
}
