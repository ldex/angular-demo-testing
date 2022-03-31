import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { TOKENKEY, FAKE_VALID_AUTH_TOKEN } from './const';
import { GetToken } from './utils';

// Declare a fake class for the JwtHelper external service
class JwtHelperServiceMock {
  isTokenExpired() : boolean {
      return false;
  }
}

// Tests in the context of the Angular Framework with a TestBed
describe('Auth Service with JwtHelperService mock', () => {
  let service, jwtHelper;
  const storageTokenKey: string = TOKENKEY;
  const authToken: string = FAKE_VALID_AUTH_TOKEN;

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
        {provide: JwtHelperService, useClass: JwtHelperServiceMock}] // Swap the real JwtHelper service with our fake class
    });

    // resolve dependencies using the TestBed injector
    service = TestBed.inject(AuthService);
    jwtHelper = TestBed.inject(JwtHelperService);
  });

  afterEach(() => {
    service = null;
    localStorage.removeItem(storageTokenKey);
  });


  ///////////////////////////////////////////////////////////
  // TESTS
  ///////////////////////////////////////////////////////////

  it('isLoggedIn() should return true if there is an authentication token', () => {
    // There is an authentication token
    localStorage.setItem(storageTokenKey, authToken);

    let res = service.isLoggedIn();
    expect(res).toBeTruthy();
  });

  it('isLoggedIn() should return false if there is no authentication token', () => {
    // no authentication token

    let res = service.isLoggedIn();
    expect(res).toBeFalsy();
  });

});
