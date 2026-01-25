import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service';
import { ApiService } from './api-service';
import { StorageService } from './storage-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { of, throwError, firstValueFrom } from 'rxjs';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;

  // Define stubs
  let apiServiceStub: { login: ReturnType<typeof vi.fn> };
  let storageStub: { storeToken: ReturnType<typeof vi.fn>; removeTokens: ReturnType<typeof vi.fn>; getToken: ReturnType<typeof vi.fn> };
  let jwtHelperStub: { isTokenExpired: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    apiServiceStub = { login: vi.fn() };
    storageStub = {
      storeToken: vi.fn(),
      removeTokens: vi.fn(),
      getToken: vi.fn()
    };
    jwtHelperStub = { isTokenExpired: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: ApiService, useValue: apiServiceStub },
        { provide: StorageService, useValue: storageStub },
        { provide: JwtHelperService, useValue: jwtHelperStub },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    // Cleanup to prevent affecting other tests
    vi.restoreAllMocks();
  });

  it('login stores token and returns true on successful response', async () => {
    apiServiceStub.login.mockReturnValue(of({ token: 'valid-token' }));
    // Mocking getToken for the computed signal
    storageStub.getToken.mockReturnValue('valid-token');
    jwtHelperStub.isTokenExpired.mockReturnValue(false);

    const result = await firstValueFrom(service.login('user', 'password'));

    expect(result).toBe(true);
    expect(storageStub.storeToken).toHaveBeenCalledWith('valid-token');

    expect(service.isLoggedIn()).toBe(true);
  });

  it('login returns false and logs error when API responds with error property', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    apiServiceStub.login.mockReturnValue(of({ error: 'Unauthorized' }));

    const result = await firstValueFrom(service.login('user', 'password'));

    expect(result).toBe(false);
    expect(storageStub.storeToken).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('login returns false on network/error (catchError path) and logs error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    apiServiceStub.login.mockReturnValue(throwError(() => new Error('network')));

    const result = await firstValueFrom(service.login('user', 'password'));

    expect(result).toBe(false);
    expect(storageStub.storeToken).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('logout removes tokens and sets loggedIn false', () => {
    // Arrange: Start as logged in
    (service as any).loggedIn.set(true);

    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    service.logout();

    expect(storageStub.removeTokens).toHaveBeenCalled();
    expect(service.isLoggedIn()).toBe(false);
    expect(infoSpy).toHaveBeenCalled();
  });

  it('isLoggedIn returns true when loggedIn true, token present and not expired', () => {
    (service as any).loggedIn.set(true);
    storageStub.getToken.mockReturnValue('token');
    jwtHelperStub.isTokenExpired.mockReturnValue(false);

    expect(service.isLoggedIn()).toBe(true);
  });

  it('isLoggedIn returns false when token is missing', () => {
    (service as any).loggedIn.set(true);
    storageStub.getToken.mockReturnValue(null);

    expect(service.isLoggedIn()).toBe(false);
  });

  it('isLoggedIn returns false when token expired', () => {
    (service as any).loggedIn.set(true);
    storageStub.getToken.mockReturnValue('token');
    jwtHelperStub.isTokenExpired.mockReturnValue(true);

    expect(service.isLoggedIn()).toBe(false);
  });
});