import {DestroyRef, inject, Injectable, Injector, signal, WritableSignal} from '@angular/core';
import { HttpClient, HttpContext } from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable, of, tap} from "rxjs";
import {JwtHelperService} from "@auth0/angular-jwt";
import {environment} from "../../../environments/environment.development";
import {Login} from "./login/interfaces";
import {User} from "./user.interface";
import {LoginResponse} from "./login/types/login-response.type";
import {LoginSuccess} from "./login/interfaces";
import {IS_PUBLIC} from "./auth.interceptor";
import {catchError} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly jwtHelper = inject(JwtHelperService);
  private readonly toastrSvc = inject(ToastrService);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly CONTEXT = {context: new HttpContext().set(IS_PUBLIC, true)};
  private readonly TOKEN_EXPIRY_THRESHOLD_MINUTES = 5;

  get user(): WritableSignal<User | null> {
    const token = localStorage.getItem('token');
    return signal(token ? this.jwtHelper.decodeToken(token) : null);
  }

  isAuthenticated(): boolean {
    return !this.jwtHelper.isTokenExpired();
  }

  isAdmin(): boolean {
    return this.user()?.roles.includes('ROLE_ADMIN') ?? false;
  }

  login(body: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/login`, body, this.CONTEXT)
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            // Handle invalid credentials
            console.log('Invalid credentials');
          }
          return of();
        }),
        tap(data => {
          const loginSuccessData = data as LoginSuccess;
          this.storeTokens(loginSuccessData);
          this.scheduleTokenRefresh(loginSuccessData.token);
          this.router.navigate(['/']);
        })
      );
  }

  refreshToken(): Observable<LoginResponse | null> {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
      return of();
    }

    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/token/refresh`, {refresh_token}, this.CONTEXT)
      .pipe(
        catchError(() => of()),
        tap(data => {
          const loginSuccessData = data as LoginSuccess;
          this.storeTokens(loginSuccessData);
          this.scheduleTokenRefresh(loginSuccessData.token);
        })
      );
  }

  storeTokens(data: LoginSuccess): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('refresh_token', data.refresh_token);
  }

  scheduleTokenRefresh(token: string): void {
    const expirationTime = this.jwtHelper.getTokenExpirationDate(token)?.getTime();
    const refreshTime = expirationTime ? expirationTime - this.TOKEN_EXPIRY_THRESHOLD_MINUTES * 60 * 1000 : Date.now();
    const refreshInterval = refreshTime - Date.now();

    if (refreshInterval > 0) {
      setTimeout(() => {
        this.refreshToken()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();
      }, refreshInterval);
    }
  }

  logout(): void {
    const refresh_token = localStorage.getItem('refresh_token');
    const translatesvc = this.injector.get(TranslateService);
    this.http.post<LoginResponse>(`${environment.apiUrl}/token/invalidate`, {refresh_token}, this.CONTEXT)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        this.router.navigate(['/login']);
        this.toastrSvc.success(translatesvc.instant('auth.logoutSuccessMessage'), undefined, {
          progressBar: true,
          positionClass: 'toast-bottom-right',
        });
      });
  }
}
