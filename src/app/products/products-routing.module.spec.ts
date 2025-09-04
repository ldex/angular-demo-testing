import { Location } from "@angular/common";
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";

import { routes } from "./products-routing.module";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { LoginRouteGuard } from "../services/login-route-guard.service";
import { AuthService } from "../services/auth.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

class JwtHelperServiceMock {
  isTokenExpired() : boolean {
      return false;
  }
}

describe('Products Routing', () => {

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

  it('navigate to "" redirects you to /', fakeAsync(() => {
    router.navigate(['']);
    tick();
    expect(location.path()).toBe('/');
  }));

  it('navigate to "insert" takes you to /login', fakeAsync(() => {
    router.navigate(['insert']);
    tick();
    expect(location.path()).toBe('/login');
  }));

  it('navigate to "123" takes you to /123', fakeAsync(() => {
    router.navigate(['123']);
    tick();
    expect(location.path()).toBe('/123');
  }));

});