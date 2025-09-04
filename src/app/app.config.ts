import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { JwtModule } from "@auth0/angular-jwt";
import { GetToken } from "./services/utils";
import { provideRouter, withComponentInputBinding, withPreloading, PreloadAllModules } from "@angular/router";
import { routes } from "./app.routes";

export const appProviders = [
        importProvidersFrom(JwtModule.forRoot({
            config: {
                tokenGetter: GetToken,
                allowedDomains: ['localhost:4200', 'https://retoolapi.dev']
            }
        })),
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter(
          routes,
          withComponentInputBinding(),
          withPreloading(PreloadAllModules)
        ),
];

export const appConfig: ApplicationConfig = {
  providers: [
    ...appProviders,
  ],
};
