import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { ProfileComponent } from './features/profile/profile.component';
import { authGuard } from './core/guards/auth.guard';
import { ForbiddenComponent } from './core/components/forbidden/forbidden.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    // data: {roles: ['ROLE_ADMIN','ROLE_USER']}
  },
  {
    path: 'profile/:userId',
    component: ProfileComponent,
    canActivate: [authGuard],
    // data: {roles: ['ROLE_ADMIN','ROLE_USER']}
  },
  {
    path: '**',
    redirectTo: '/home',
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent,
  },
];
