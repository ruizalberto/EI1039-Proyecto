// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
// import { Observable, map } from 'rxjs';
// import { UserService } from './user.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthguardService implements CanActivateFn {

//   constructor(private userService: UserService, private router: Router) {}

//   canActivateFn(): boolean {
//     this.userService.getInfoUserLogged().subscribe(user => {
//       if (user) {
//         return true;
//       } else {
//         this.router.navigate(['/login']);
//         return false;
//       }
//     }
//   }
// }
