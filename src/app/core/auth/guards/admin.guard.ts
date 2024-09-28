import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../auth.service";

export const adminGuard: CanActivateFn = (route, state) => {
  if (!inject(AuthService).isAdmin()) {
    inject(Router).navigate(['/']);
    return false;
  }
  return true;
}
