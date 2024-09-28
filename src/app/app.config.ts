import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {HttpClient, HttpContext, provideHttpClient, withInterceptors} from "@angular/common/http";
import {JwtModule} from "@auth0/angular-jwt";
import {authInterceptor, IS_PUBLIC} from "./core/auth/auth.interceptor";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideToastr} from "ngx-toastr";
import {Observable} from "rxjs";
import {AuthService} from "./core/auth/auth.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimations(),
    provideToastr(),
    provideHttpClient(
      withInterceptors([authInterceptor]),
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializerFactory,
      multi: true,
      deps: [AuthService, TranslateService],
    },
    importProvidersFrom([
      HttpClient,
      JwtModule.forRoot({
        config: {
          tokenGetter: () => localStorage.getItem('token')
        }
      }),
      TranslateModule.forRoot({
        defaultLanguage: 'fr',
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => new MyTranslateLoader(),
          deps: [HttpClient]
        },
      })
    ])
  ]
};

export class MyTranslateLoader implements TranslateLoader {
  private readonly CONTEXT = {context: new HttpContext().set(IS_PUBLIC, true)};
  private readonly http = inject(HttpClient);

  public getTranslation(lang: string): Observable<Object> {
    return this.http.get(`/assets/i18n/${lang}.json`, this.CONTEXT);
  }
}

export function initializerFactory(authService: AuthService, translateService: TranslateService) {
  return () => {
    const defaultLang = translateService.getDefaultLang();
    const localStorageLang = localStorage.getItem('language');
    if (!localStorageLang) {
      localStorage.setItem('language', defaultLang);
    }
    translateService.use(localStorageLang ?? defaultLang);

    return authService.refreshToken();
  };
}
