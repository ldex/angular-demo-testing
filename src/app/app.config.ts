import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  withDebugTracing,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { JwtModule } from '@auth0/angular-jwt';
import { config } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => {
            return localStorage.getItem(config.storageTokenKey);
          },
          allowedDomains: ['localhost:4200'],
        },
      })
    ),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withPreloading(PreloadAllModules),
      //withDebugTracing(),
      withViewTransitions()
    ),
  ],
};
