import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { LoginService } from './login.service';
import { TOKENKEY, VALID_TOKEN } from './const';
import { GetToken } from './utils';


// Tests without a TestBed
describe('Login Service with Http and jwtHelper jasmine mock, no module setup', () => {
    const storageTokenKey: string = TOKENKEY;

    afterEach(() => {
      // Delete the local token
      localStorage.removeItem(storageTokenKey);
    });


    it('isLoggedIn() should return true if there is a token', () => {

      // Set a local token
      localStorage.setItem(storageTokenKey, '1234');

      // Create a JwtHelperService mock with a isTokenExpired method
      const jwtServiceMock = jasmine.createSpyObj('JwtHelper', ["isTokenExpired"]) ;
      // Simulate a return value if isTokenExpired() is called
      jwtServiceMock.isTokenExpired.and.returnValue(false);

      // Create a mock for HttpClient
      const httpMock = jasmine.createSpyObj('HttpClient', ["post"]) ;

      const srv = new LoginService(httpMock, jwtServiceMock);

      const res = srv.isLoggedIn();

      expect(res).toBeTruthy();
      expect(jwtServiceMock.isTokenExpired).toHaveBeenCalledTimes(1);
    });

    it('isLoggedIn() should return false if there is a no token', () => {

      // Create a JwtHelperService mock with a isTokenExpired method
      const jwtServiceMock = jasmine.createSpyObj('JwtHelper', ["isTokenExpired"]) ;
      // Simulate a return value if isTokenExpired() is called
      jwtServiceMock.isTokenExpired.and.returnValue(false);

      // Create a mock for HttpClient
      const httpMock = jasmine.createSpyObj('HttpClient', ["post"]) ;

      const srv = new LoginService(httpMock, jwtServiceMock);

      const res = srv.isLoggedIn();

      expect(res).toBeFalsy();
      expect(jwtServiceMock.isTokenExpired).toHaveBeenCalledTimes(0);
    });

});

// Tests in the context of the Angular Framework with a TestBed
describe('Login Service with JwtHelperService spy', () => {
  let service, httpMock, jwtHelper;
  let spy: any;
  const storageTokenKey: string = TOKENKEY;

  beforeEach(() => {
    // creates a test Angular Module which we can use to instantiate components
    // perform dependency injection and so on
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        JwtModule.forRoot({
          config: {
            tokenGetter: GetToken,
            whitelistedDomains: ['localhost:4200', 'localhost:9876', 'storerestservice.azurewebsites.net']
          }
        })
      ],
      providers: [
        LoginService, 
        JwtHelperService
      ]
    });
    // resolve dependencies using the TestBed injector
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);    
    jwtHelper = TestBed.inject(JwtHelperService);
    // resolve dependencies using the TestBed injector
   // service = TestBed.inject(LoginService);
   // JwtHelperService = TestBed.inject(JwtHelperService); // We get the real service here, will mock its methods with spyOn
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
    localStorage.setItem(storageTokenKey, VALID_TOKEN);

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
