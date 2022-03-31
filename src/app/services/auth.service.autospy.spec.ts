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
  const authToken: string = FAKE_VALID_AUTH_TOKEN;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        JwtModule
      ],
      providers: [
        AuthService,
        provideAutoSpy(JwtHelperService) // same as {provide: JwtHelperService, useClass: createSpyFromClass(JwtHelperService)}
      ]
    });
    service = TestBed.inject(AuthService);
    jwtHelperServiceSpy = TestBed.inject<any>(JwtHelperService);
  });

  afterEach(() => {
    localStorage.removeItem(storageTokenKey);
  });


  ///////////////////////////////////////////////////////////
  // TESTS
  ///////////////////////////////////////////////////////////

  it('isLoggedIn() should return true if there is an authentication token', () => {
    // There is an authentication token in local storage
    localStorage.setItem(storageTokenKey, authToken);

    jwtHelperServiceSpy.isTokenExpired.and.returnValue(false);

    const res = service.isLoggedIn();

     expect(res).toBeTruthy();
     expect(jwtHelperServiceSpy.isTokenExpired).toHaveBeenCalled();
  });

  it('isLoggedIn() should return false if there is no authentication token', () => {
    // No authentication token in local storage

    jwtHelperServiceSpy.isTokenExpired.and.returnValue(false);

    let res = service.isLoggedIn();

     expect(res).toBeFalsy();
     expect(jwtHelperServiceSpy.isTokenExpired).not.toHaveBeenCalled();
  });

});
