import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import type { CanActivateFn } from '@angular/router';

export const accessGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const isLoggedIn = localStorage.getItem('userToken') !== null;
    if (isLoggedIn) {
      return true;
    }
    return router.createUrlTree(['/login']);
  }

  return true;
};