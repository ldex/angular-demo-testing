import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, vi } from 'vitest';
import { loginRouteGuard } from './login-route.guard';
import { AuthService } from './core/auth-service';
import { Component } from '@angular/core';
import { RouterTestingHarness } from '@angular/router/testing';

@Component({ template: '<h1>Protected Page</h1>' })
class ProtectedComponent {}

@Component({ template: '<h1>Login Page</h1>' })
class LoginComponent {}

describe('loginRouteGuard', () => {
  let authServiceMock;
  let harness: RouterTestingHarness;

  async function setup(isAuthenticated: boolean) {
    this.authServiceMock = {
      isLoggedIn: vi.fn()
    };
    this.authServiceMock.isLoggedIn.and.returnValue(isAuthenticated);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        provideRouter([
          { path: 'protected', component: ProtectedComponent, canActivate: [loginRouteGuard] },
          { path: 'login', component: LoginComponent },
        ]),
      ],
    });
    harness = await RouterTestingHarness.create();
  }

  it('allows navigation when user is logged in', async () => {
    await setup(true);
    await harness.navigateByUrl('/protected', ProtectedComponent);
    // The protected component should render when authenticated
    expect(harness.routeNativeElement?.textContent).toContain('Protected Page');
  });

  it('redirects to login when user is not logged in', async () => {
    await setup(false);
    await harness.navigateByUrl('/protected', LoginComponent);
    // The login component should render after redirect
    expect(harness.routeNativeElement?.textContent).toContain('Login Page');
  });
});