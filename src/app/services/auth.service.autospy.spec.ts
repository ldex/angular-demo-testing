import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { provideAutoSpy, Spy } from 'jasmine-auto-spies';
import { AuthService } from './auth.service';
import { TOKENKEY, FAKE_VALID_AUTH_TOKEN } from './const';
import { GetToken } from './utils';

describe('Auth Service with JwtHelperService auto spy', () => {
  let service;
  let jwtHelperServiceSpy: Spy<JwtHelperService>;
  const storageTokenKey: string = TOKENKEY;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        JwtModule.forRoot({ config: {tokenGetter: GetToken} })
      ],
      providers: [
        AuthService,
        provideAutoSpy(JwtHelperService)
      ]
    });
    service = TestBed.inject(AuthService);
    jwtHelperServiceSpy = TestBed.inject<any>(JwtHelperService);
  });

  afterEach(() => {
    service = null;
    localStorage.removeItem(storageTokenKey);
  });


  ///////////////////////////////////////////////////////////
  // TESTS
  ///////////////////////////////////////////////////////////

  it('isLoggedIn() should return true if there is a token', () => {
    // There is a token
    localStorage.setItem(storageTokenKey, FAKE_VALID_AUTH_TOKEN);

    jwtHelperServiceSpy.isTokenExpired.and.returnValue(false);

    const res = service.isLoggedIn();

     expect(res).toBeTruthy();
     expect(jwtHelperServiceSpy.isTokenExpired).toHaveBeenCalled();
  });

  it('isLoggedIn() should return false if there is no token', () => {
    // No token

    jwtHelperServiceSpy.isTokenExpired.and.returnValue(false);

    let res = service.isLoggedIn();

     expect(res).toBeFalsy();
     expect(jwtHelperServiceSpy.isTokenExpired).not.toHaveBeenCalled();
  });

});
