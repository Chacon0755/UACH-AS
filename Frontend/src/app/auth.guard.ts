import { CanActivateFn, Router } from '@angular/router';
import { Injector } from '@angular/core';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const injector = Injector.create({
    providers: [
      { provide: AuthService, deps: [] }
    ]
  });
  const authService = injector.get(AuthService);
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    const router = injector.get(Router);
    router.navigate(['/login'])
    return false
  }

  return true;
};
