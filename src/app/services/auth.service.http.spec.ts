import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { TOKENKEY, FAKE_VALID_AUTH_TOKEN, AUTH_BASE_URL } from './const';
import { GetToken } from './utils';

// Tests in the context of the Angular Framework with a TestBed
// Replacing HTTP calls with a httpMock
describe('Auth Service mocking Http', () => {
  let service, httpMock, jwtHelper;
  const baseUrl: string = AUTH_BASE_URL;
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
        JwtHelperService
      ]
    });

    // resolve dependencies using the TestBed injector
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    jwtHelper = TestBed.inject(JwtHelperService);
  });

  afterEach(() => {
    httpMock.verify(); // assert that there are no outstanding Http requests
    service = null;
    localStorage.removeItem(storageTokenKey);
  });


  ///////////////////////////////////////////////////////////

  it('should return true from getToken when there is an authentication token', () => {
    localStorage.setItem(storageTokenKey, authToken);
    expect(service.getToken()).toBeTruthy();
  });

  it('should return false from getToken when there is no authentication token', () => {
    expect(service.getToken()).toBeFalsy();
  });

  it('should login with admin', fakeAsync(() => {
    let result;
    const dummyResponse = {token: authToken}

    service
      .login("admin", "admin")
      .subscribe(response => result = response);

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe("POST");
      req.flush(dummyResponse);

      expect(result).toBeTruthy();
  }));

  it('should not login with user', fakeAsync(() => {
    let result;
    let dummyResponse = {error: 'Invalid!'}

    service
    .login("user", "user")
    .subscribe(response => result = response);

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe("POST");
    req.flush(dummyResponse);

    expect(result).toBeFalsy();
  }));
});
