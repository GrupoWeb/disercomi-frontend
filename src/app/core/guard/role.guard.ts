import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {AuthService} from "@core";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {


  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const allowedRoles = (next.data as { ['allowedRoles']: string[] }).allowedRoles;
    const userRoles = this.authService.currentProfileUserValue.idRol;
    console.log("rol " + userRoles)
    const isAuthorized = allowedRoles.some(role => userRoles.includes(role));

    if (isAuthorized) {
      return true;
    } else {
      return this.router.parseUrl('/404');
    }
  }
}
