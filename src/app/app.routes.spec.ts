import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';
import { RouterTestingHarness } from '@angular/router/testing';
import { Home } from './shared/home';
import { NavError } from './shared/nav-error';
import { Contact } from './shared/contact';
import { Component } from '@angular/core';
import { Products } from './products/products';

describe('Basic App Routing', () => {
  let router: Router;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });

    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
  });

  it('should navigate to the home page for "" path', async () => {
    await harness.navigateByUrl('/');
    expect(router.url).toBe('/home');
    expect(harness.routeDebugElement.componentInstance instanceof Home).toBe(true);
  });

  it('should navigate to products and load child routes', async () => {
    await harness.navigateByUrl('/products');
    expect(router.url).toBe('/products');
    expect(harness.routeDebugElement.componentInstance instanceof Products).toBe(true);
  });

  it('should navigate to the contact page for "/contact" path', async () => {
    await harness.navigateByUrl('/contact');
    expect(router.url).toBe('/contact');
    expect(harness.routeDebugElement.componentInstance instanceof Contact).toBe(true);
  });

  it('should navigate to the error page for an unknown path', async () => {
    await harness.navigateByUrl('/unknown-path');
    expect(router.url).toBe('/404');
    expect(harness.routeDebugElement.componentInstance instanceof NavError).toBe(true);
  });
});

@Component({ template: '<h1>Protected Page</h1>', selector: 'app-protected' })
class AdminMock {}

@Component({ template: '<h1>Login Page</h1>', selector: 'app-login' })
class LoginMock {}

describe('App Routing using canActivate', () => {
  let router: Router;
  let harness: RouterTestingHarness;

  // Helper function to simulate different guard outcomes (user authenticated or not)
  async function setup(isAuthenticated: boolean) {
    const loginRouteGuardMock = vi.fn().mockImplementation(() => {
    if (isAuthenticated) return true;

    // Create a redirect to '/login' using the Router service
    const routerService = TestBed.inject(Router);
    return routerService.parseUrl('/login');
  });
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
            { path: 'admin', component: AdminMock, canActivate: [loginRouteGuardMock] },
            { path: 'login', component: LoginMock }
        ]),
      ],
    });
    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
  }

  it('should allow navigation to admin page if guard returns true', async () => {
    await setup(true); // user is authenticated
    await harness.navigateByUrl('/admin');
    expect(router.url).toBe('/admin');
    expect(harness.routeDebugElement.componentInstance instanceof AdminMock).toBe(true);
  });

  it('should redirect to the login page if guard returns false', async () => {
    await setup(false); // user is not authenticated
    await harness.navigateByUrl('/admin');
    expect(router.url).toBe('/login');
    expect(harness.routeDebugElement.componentInstance instanceof LoginMock).toBe(true);
  });
});