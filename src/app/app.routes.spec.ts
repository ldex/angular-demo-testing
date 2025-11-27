import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';
import { RouterTestingHarness } from '@angular/router/testing';
import { Admin } from './shared/admin';
import { Home } from './shared/home';
import { NavError } from './shared/nav-error';
import { Contact } from './shared/contact';

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


describe('App Routing using canActivate', () => {
  let router: Router;
  let harness: RouterTestingHarness;

  async function setup(isAuthenticated: boolean) {
    let loginRouteGuard = vi.fn().mockReturnValue(isAuthenticated);
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
            { path: 'admin', component: Admin, title: 'Admin', canActivate: [loginRouteGuard] },
        ]),
      ],
    });
    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
  }

  it('should allow navigation to admin page if guard returns true', async () => {
    await setup(true);
    await harness.navigateByUrl('/admin');
    expect(router.url).toBe('/admin');
  });

  it('should redirect from the admin page if guard returns false', async () => {
    await setup(false);
    await harness.navigateByUrl('/admin');
    expect(router.url).toBe('/login');
  });
});