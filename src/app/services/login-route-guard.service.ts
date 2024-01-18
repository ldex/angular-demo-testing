import { Router } from '@angular/router';
import { AuthService } from './auth.service';

import { Injectable } from '@angular/core';

@Injectable()
export class LoginRouteGuard  {

  constructor(
    private authService: AuthService,
    private router: Router) {}

  canActivate() {
    if(!this.authService.isLoggedIn()) {
      this.router.navigateByUrl("/login");
      return false;
    }
    return true;
  }
}