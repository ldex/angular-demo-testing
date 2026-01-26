import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, vi } from 'vitest';
import { loginRouteGuard } from './login-route.guard';
import { AuthService } from './core/auth-service';
import { Component } from '@angular/core';
import { RouterTestingHarness } from '@angular/router/testing';

@Component({ template: '<h1>Protected Page</h1>', selector: 'app-protected' })
class ProtectedComponent {}

@Component({ template: '<h1>Login Page</h1>', selector: 'app-login' })
class LoginComponent {}

describe('loginRouteGuard', () => {
  let authServiceMock: { isLoggedIn: ReturnType<typeof vi.fn> };
  let harness: RouterTestingHarness;

  async function setup(isAuthenticated: boolean) {
    authServiceMock = {
      isLoggedIn: vi.fn()
    };
    vi.spyOn(authServiceMock, 'isLoggedIn').mockReturnValue(isAuthenticated);
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
    await harness.navigateByUrl('/protected');
    // The protected component should render when authenticated
    expect(harness.routeDebugElement.componentInstance instanceof ProtectedComponent).toBe(true);
  });

  it('redirects to login when user is not logged in', async () => {
    await setup(false);
    await harness.navigateByUrl('/protected');
    // The login component should render after redirect
    expect(harness.routeDebugElement.componentInstance instanceof LoginComponent).toBe(true);
  });
});