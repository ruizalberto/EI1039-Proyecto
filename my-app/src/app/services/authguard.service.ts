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
// export class AuthguardService {

//   constructor(private userService: UserService, private router: Router) {}

//   canActivate(): boolean {

//     this.userService.getInfoUserLogged().pipe(
//       map(user => {
//         console.log("revisando...");
//         if (user) {
//           return true; // Usuario autenticado, permitir acceso
//         } else {
//           this.router.navigate(['/login']); // Usuario no autenticado, redirigir a la página de inicio de sesión
//           return false;
//         }
//       })
//     );
//     return false;
//   }
// }

// export const authGuardGuard: CanActivateFn = (route, state) => {
//   return inject(AuthguardService).canActivate();
// };
