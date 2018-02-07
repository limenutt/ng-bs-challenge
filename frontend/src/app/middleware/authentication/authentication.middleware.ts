import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../../services/authentication/authentication.service';

@Injectable()
export class AuthenticationMiddleware implements CanActivate {
  constructor(private router: Router, private authService: AuthenticationService) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.checkLogin();
  }
  private async checkLogin(): Promise<boolean> {
    const authenticated = await this.authService.isAuthenticated();
    if (!authenticated) {
      this.router.navigate(['/login']);
    }

    return authenticated;
  }
}