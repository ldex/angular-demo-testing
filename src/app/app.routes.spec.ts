import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';
import { Component } from '@angular/core';
import { LoginRouteGuard } from './services/login-route-guard.service';
import { AuthService } from './services/auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { JwtHelperService } from '@auth0/angular-jwt';

// Mock component for lazy-loaded routes
@Component({ template: '' })
class ProductsRoutesStubComponent {}

class JwtHelperServiceMock {
  isTokenExpired() : boolean {
      return false;
  }
}

describe('App Routing', () => {
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        AuthService,
        LoginRouteGuard,
        {provide: JwtHelperService, useClass: JwtHelperServiceMock},
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    router.initialNavigation();
  });

  it('should navigate to the home page for "" path', async () => {
    await router.navigateByUrl('');
    expect(location.path()).toBe('/home');
  });

  it('should navigate to the contact page for "/contact" path', async () => {
    await router.navigateByUrl('/contact');
    expect(location.path()).toBe('/contact');
  });

  it('should navigate to the error page for an unknown path', async () => {
    await router.navigateByUrl('/unknown-path');
    expect(location.path()).toBe('/error?reason=NavError');
  });

  it('should allow navigation to admin page if guard returns true', async () => {
    const loginGuard = TestBed.inject(LoginRouteGuard);
    spyOn(loginGuard, 'canActivate').and.returnValue(true);

    await router.navigateByUrl('/admin');
    expect(location.path()).toBe('/admin');
  });

  it('should redirect from the admin page if guard returns false', async () => {
    const loginGuard = TestBed.inject(LoginRouteGuard);
    spyOn(loginGuard, 'canActivate').and.returnValue(false);

    await router.navigateByUrl('/admin');
    // We expect the navigation to fail and the URL to remain unchanged.
    expect(location.path()).not.toBe('/admin');
  });
});
