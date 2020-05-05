import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { LoginService } from './login.service';
import { TOKENKEY, AUTH_BASE_URL } from './const';
import { GetToken } from './utils';

// Tests in the context of the Angular Framework with a TestBed
// Replacing HTTP calls with a httpMock
describe('Login Service mocking Http', () => {
  let service, httpMock, jwtHelper;
  const baseUrl: string = AUTH_BASE_URL;
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
  });

  afterEach(() => {
    httpMock.verify(); // assert that there are no outstanding Http requests
    service = null;
    localStorage.removeItem(storageTokenKey);
  });


  ///////////////////////////////////////////////////////////
  
  it('should return true from getToken when there is a token', () => {
    localStorage.setItem(storageTokenKey, '1234');
    expect(service.getToken()).toBeTruthy();
  });

  it('should return false from getToken when there is no token', () => {
    expect(service.getToken()).toBeFalsy();
  });

  it('should login with admin', done => {

    service
      .login("admin", "admin")
      .subscribe(
        result => {
          expect(result).toBeTruthy();
          done();
        }
      ); 

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe("POST");
      req.flush({token: '123'});
  });

  it('should not login with user', done => {

    service
    .login("user", "user")
    .subscribe(
      result => {
        expect(result).toBeFalsy();
        done();
      }
    );  

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe("POST");
    req.flush({error: 'Invalid!'});

  });
});
