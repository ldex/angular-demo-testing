import { Location } from "@angular/common";
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";

import { routes } from "./app-routing.module";
import { AuthService } from "./services/auth.service";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { JwtHelperService } from "@auth0/angular-jwt";
import { LoginRouteGuard } from "./services/login-route-guard.service";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

class JwtHelperServiceMock {
  isTokenExpired() : boolean {
      return false;
  }
}

describe('App Routing', () => {

  let location: Location;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule.withRoutes(routes)],
    providers: [
        AuthService,
        LoginRouteGuard,
        { provide: JwtHelperService, useClass: JwtHelperServiceMock },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    router.initialNavigation();
  });

  it('navigate to "" redirects you to /home', fakeAsync(() => {
    router.navigate(['']);
    tick();
    expect(location.path()).toBe('/home');
  }));

  it('navigate to "home" takes you to /home', fakeAsync(() => {
    router.navigate(['home']);
    tick();
    expect(location.path()).toBe('/home');
  }));

  it('navigate to "contact" takes you to /contact', fakeAsync(() => {
    router.navigate(['contact']);
    tick();
    expect(location.path()).toBe('/contact');
  }));

  it('navigate to "login" takes you to /login', fakeAsync(() => {
    router.navigate(['login']);
    tick();
    expect(location.path()).toBe('/login');
  }));

  it('navigate to "admin" takes you to /login', fakeAsync(() => {
    router.navigate(['admin']);
    tick();
    expect(location.path()).toBe('/login');
  }));

  it('navigate to "error" takes you to /error', fakeAsync(() => {
    router.navigate(['error']);
    tick();
    expect(location.path()).toBe('/error');
  }));

  it('navigate to "not_valid" takes you to /error', fakeAsync(() => {
    router.navigate(['not_valid']);
    tick();
    expect(location.path()).toBe('/error?reason=NavError');
  }));
});