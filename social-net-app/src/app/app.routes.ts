import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        redirectTo:'/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent ,
        canActivate: [authGuard],
        // data: {roles: ['ROLE_ADMIN','ROLE_USER']}
      },
      {
        path: '**',
        redirectTo: '/home'
      }
];
