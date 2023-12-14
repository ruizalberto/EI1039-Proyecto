import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs';
import { UserService } from './user.service';

export const AuthguardService: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService: UserService = inject(UserService);
  const router: Router = inject(Router);

  return authService.getInfoUserLogged().pipe(
    map((status) => {
      console.log(status);
      if (status) {
        return true;
      }

      return router.createUrlTree(['/login']);
    })
  );
};
