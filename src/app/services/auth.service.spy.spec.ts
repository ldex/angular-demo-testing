import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { TOKENKEY, FAKE_VALID_AUTH_TOKEN } from './const';
import { GetToken } from './utils';


// Tests in the context of the Angular Framework with a TestBed
describe('Auth Service with JwtHelperService spy', () => {
  let service;
  const storageTokenKey: string = TOKENKEY;

  beforeEach(() => {
    // creates a test Angular Module which we can use to instantiate components
    // perform dependency injection and so on
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        JwtModule.forRoot({ config: {tokenGetter: GetToken} })
      ],
      providers: [
        AuthService,
        JwtHelperService
      ]
    });
    service = TestBed.inject(AuthService);
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

    // We pretend it's not expired from JwtHelperService external dependency
    const spy = jasmine.createSpyObj('JwtHelperService', ['isTokenExpired']);
    const stubValue = false;
    spy.isTokenExpired.and.returnValue(stubValue);

    const res = service.isLoggedIn();

     expect(res).toBeTruthy();
  });

  it('isLoggedIn() should return false if there is no token', () => {
    // No token

    // Spy for external dependency but should not be called anyway
    const spy = jasmine.createSpyObj('JwtHelperService', ['isTokenExpired']);
    const stubValue = false;
    spy.isTokenExpired.and.returnValue(stubValue);

    let res = service.isLoggedIn();

     expect(res).toBeFalsy();
     expect(spy.isTokenExpired).not.toHaveBeenCalled();
  });

});
