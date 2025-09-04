import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { LoginRouteGuard } from './app/services/login-route-guard.service';
import { AuthService } from './app/services/auth.service';
import { AdminService } from './app/services/admin.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app/app-routing.module';
import { JwtModule } from '@auth0/angular-jwt';
import { GetToken } from './app/services/utils';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, AppRoutingModule, JwtModule.forRoot({
            config: {
                tokenGetter: GetToken,
                allowedDomains: ['localhost:4200', 'storerestservice.azurewebsites.net', 'https://retoolapi.dev']
            }
        })),
        LoginRouteGuard,
        AuthService,
        AdminService,
        provideHttpClient(withInterceptorsFromDi())
    ]
})
  .catch(err => console.error(err));
