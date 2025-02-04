// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {
//   if (sessionStorage.getItem('email')) {
//     return true;
//   } else {
//     const router = inject(Router);
//     router.navigate(['login']);
//     return false;
//   }
// };
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  if (sessionStorage.getItem('userId')) {
    return true; // User is authenticated
  } else {
    const router = inject(Router);
    router.navigate(['login']); // Redirect to login if not authenticated
    return false; // Block navigation
  }
};
