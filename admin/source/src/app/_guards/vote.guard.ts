import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OptionsService } from '../_services/options.service';

@Injectable({
  providedIn: 'root'
})
export class VoteGuard implements CanActivate {
  constructor(
    private os: OptionsService,
    private router: Router
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      this.os.state$.subscribe(appState => {
        if (!appState) { return; }

        if (appState === 'vote') {
          return resolve(true);
        }
        this.router.navigate(['not-found']);
        return resolve(false);
      });
    });
  }
}
