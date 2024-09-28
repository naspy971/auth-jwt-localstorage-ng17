import {Routes} from "@angular/router";

export const adminRoutes: Routes = [
  {path: 'users', loadChildren: () => import('./users/users.routes').then(mod => mod.usersRoutes)},
];
