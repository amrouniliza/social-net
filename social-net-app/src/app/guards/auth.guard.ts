import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.AuthenticatedUser$.pipe(
    take(1), // take the first one and then unsubscribe automatically
    map(user => {
      // check if route is restricted by role
      // const { roles } = route.data;
      // if(user && user.role && roles.includes(user.role.name)) {
      //  return true;
      // }
      if(user) {
        return true
      //  return  router.createUrlTree(['/forbidden']);
      }
      return  router.createUrlTree(['/login']);
    })
  )
};
