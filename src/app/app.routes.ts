import {Routes} from '@angular/router';
import {authGuard, accountGuard, adminGuard} from "./core/auth/guards";

export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {
    path: 'home',
    loadComponent: () => import('./features/home/pages/home.page').then(mod => mod.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(mod => mod.adminRoutes),
    canActivate: [adminGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/login/pages/login.page').then(mod => mod.LoginPage),
    canActivate: [accountGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./core/auth/register/pages/register.page').then(mod => mod.RegisterPage),
    canActivate: [accountGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/pages/not-found.page').then(mod => mod.NotFoundPage)
  },
];
