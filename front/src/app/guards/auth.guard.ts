import {CanActivateFn, Router} from '@angular/router';
import {catchError, map, of} from "rxjs";
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check token validity using AuthService
  return authService.isTokenValid().pipe(
    map((isValid: boolean) => {
      if (isValid) {
        return true;
      } else {
        router.navigate(['/auth']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/auth']);
      return of(false);
    })
  );
};
