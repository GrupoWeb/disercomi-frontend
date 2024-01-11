import { Injectable } from '@angular/core';
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate} from '@angular/router';

import { AuthService } from '@core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const isAuthenticated = this.authService.isAuthenticated();


    if (isAuthenticated) {
      return true;
    }

    this.router.navigate(['/authentication/signin'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
