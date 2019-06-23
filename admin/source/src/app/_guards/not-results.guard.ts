import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OptionsService } from '../_services/options.service';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotResultsGuard implements CanActivate {
  constructor(
    private os: OptionsService,
    private router: Router
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.os.state$.pipe(
      filter(v => !!v),
      map(s => {
        console.log(s)
        return s !== 'results' ? true : this.router.parseUrl('/not-found');
      })
    );
  }
}
