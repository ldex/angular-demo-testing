import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { TOKENKEY, FAKE_VALID_AUTH_TOKEN } from './const';
import { GetToken } from './utils';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

// Tests in the context of the Angular Framework with a TestBed
describe('Auth Service with JwtHelperService spy', () => {
  let service: AuthService;
  let jwtHelperService: any;
  const storageTokenKey: string = TOKENKEY;

  beforeEach(() => {
    // creates a test Angular Module which we can use to instantiate components
    // perform dependency injection and so on
    TestBed.configureTestingModule({
      imports: [JwtModule.forRoot({ config: { tokenGetter: GetToken } })],
      providers: [
        AuthService,
        JwtHelperService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthService);
    jwtHelperService = TestBed.inject(JwtHelperService);
  });

  afterEach(() => {
    localStorage.removeItem(storageTokenKey); // clear local storage after each test
  });

  ///////////////////////////////////////////////////////////
  // TESTS
  ///////////////////////////////////////////////////////////

  it('isLoggedIn() should return true if there is a valid auth token', () => {
    // There is a token in local storage
    localStorage.setItem(storageTokenKey, FAKE_VALID_AUTH_TOKEN);

    // Simulate a return value if isTokenExpired() is called
    spyOn(jwtHelperService, 'isTokenExpired').and.returnValue(false);

    const res = service.isLoggedIn();

    expect(res).toBeTruthy();
    expect(jwtHelperService.isTokenExpired).toHaveBeenCalled();
  });

  it('isLoggedIn() should return false if there is no auth token', () => {
    // No token in local storage

    // Spy for external dependency but should not be called anyway
    spyOn(jwtHelperService, 'isTokenExpired').and.returnValue(false);

    let res = service.isLoggedIn();

    expect(res).toBeFalsy();
    expect(jwtHelperService.isTokenExpired).not.toHaveBeenCalled();
  });
});
