import { JwtModule } from '@auth0/angular-jwt';
import { AdminService } from './services/admin.service';
import { ErrorComponent } from './common/error.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './common/login.component';
import { AuthService } from './services/auth.service';
import { LoginRouteGuard } from './services/login-route-guard.service';
import { AdminComponent } from './common/admin.component';
import { ContactComponent } from './common/contact.component';
import { HomeComponent } from './common/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { GetToken } from './services/utils';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactComponent,
    AdminComponent,
    LoginComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: GetToken,
        allowedDomains: ['localhost:4200', 'storerestservice.azurewebsites.net', 'https://retoolapi.dev']
      }
    }),
  ],
  providers: [
    LoginRouteGuard,
    AuthService,
    AdminService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
