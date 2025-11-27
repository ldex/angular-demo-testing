import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service';
import { ApiService } from './api-service';
import { StorageService } from './storage-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { of, throwError, firstValueFrom } from 'rxjs';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let apiService: { login: ReturnType<typeof vi.fn> };
  let storage: { storeToken: ReturnType<typeof vi.fn>; removeTokens: ReturnType<typeof vi.fn>; getToken: ReturnType<typeof vi.fn> };
  let jwtHelper: { isTokenExpired: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    apiService = { login: vi.fn() };
    storage = { storeToken: vi.fn(), removeTokens: vi.fn(), getToken: vi.fn() };
    jwtHelper = { isTokenExpired: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: ApiService, useValue: apiService },
        { provide: StorageService, useValue: storage },
        { provide: JwtHelperService, useValue: jwtHelper },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('login stores token and returns true on successful response', async () => {
    apiService.login.mockReturnValue(of({ token: 'tok' }));

    const result = await firstValueFrom(service.login('u', 'p'));

    expect(result).toBe(true);
    expect(storage.storeToken).toHaveBeenCalledWith('tok');
    // loggedIn signal should be true
    expect((service as unknown as any).loggedIn()).toBe(true);
  });

  it('login returns false and logs error when API responds with error property', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    apiService.login.mockReturnValue(of({ error: 'bad creds' }));

    const result = await firstValueFrom(service.login('u', 'p'));

    expect(result).toBe(false);
    expect(storage.storeToken).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('login returns false on network/error (catchError path) and logs error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    apiService.login.mockReturnValue(throwError(() => new Error('network')));

    const result = await firstValueFrom(service.login('u', 'p'));

    expect(result).toBe(false);
    expect(storage.storeToken).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('logout removes tokens and sets loggedIn false', () => {
    // set loggedIn true first
    (service as unknown as any).loggedIn.set(true);

    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    service.logout();

    expect(storage.removeTokens).toHaveBeenCalled();
    expect((service as unknown as any).loggedIn()).toBe(false);
    expect(infoSpy).toHaveBeenCalled();
    infoSpy.mockRestore();
  });

  it('isLoggedIn returns true when loggedIn true, token present and not expired', () => {
    (service as unknown as any).loggedIn.set(true);
    storage.getToken.mockReturnValue('token');
    jwtHelper.isTokenExpired.mockReturnValue(false);

    expect(service.isLoggedIn()).toBe(true);
  });

  it('isLoggedIn returns false when token is missing', () => {
    (service as unknown as any).loggedIn.set(true);
    storage.getToken.mockReturnValue(null);

    expect(service.isLoggedIn()).toBe(false);
  });

  it('isLoggedIn returns false when token expired', () => {
    (service as unknown as any).loggedIn.set(true);
    storage.getToken.mockReturnValue('token');
    jwtHelper.isTokenExpired.mockReturnValue(true);

    expect(service.isLoggedIn()).toBe(false);
  });
});