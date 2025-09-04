import { Router } from '@angular/router';
import { AuthService } from './auth.service';

import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginRouteGuard  {
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {}

  canActivate() {
    if(!this.authService.isLoggedIn()) {
      this.router.navigateByUrl("/login");
      return false;
    }
    return true;
  }
}