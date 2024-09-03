import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLogged.pipe(
    take(1),
    map((isLogged) => (isLogged ? true : false)),
    // tap((isLogged) => !isLogged && router.navigate(['/login'])),
    tap((isLogged) => console.log(isLogged)),
  );
};
