import { AuthService } from './auth.service';
import { TOKENKEY, FAKE_VALID_AUTH_TOKEN } from './const';

// Tests without a TestBed
describe('Auth Service with Http and jwtHelper spies, no module setup', () => {
    const storageTokenKey: string = TOKENKEY;
    const authToken: string = FAKE_VALID_AUTH_TOKEN;

    afterEach(() => {
      // Delete the local token
      localStorage.removeItem(storageTokenKey);
    });

    it('isLoggedIn() should return true if there is an authentication token', () => {

      // Set a local token
      localStorage.setItem(storageTokenKey, authToken);

      // Create a JwtHelperService spy with a isTokenExpired method
      const jwtServiceSpy = jasmine.createSpyObj('JwtHelperService', ["isTokenExpired"]) ;
      // Simulate a return value if isTokenExpired() is called
      jwtServiceSpy.isTokenExpired.and.returnValue(false);

      // Create a spy for HttpClient
      const httpSpy = jasmine.createSpyObj('HttpClient', ["post"]) ;

      // Instanciate the service manually with our spies
      const srv = new AuthService(httpSpy, jwtServiceSpy);

      const res = srv.isLoggedIn();

      expect(res).toBeTruthy();
      expect(jwtServiceSpy.isTokenExpired).toHaveBeenCalledTimes(1);
    });

    it('isLoggedIn() should return false if there is a no authentication token', () => {

      // Create a JwtHelperService spy with a isTokenExpired method
      const jwtServiceSpy = jasmine.createSpyObj('JwtHelperService', ["isTokenExpired"]) ;
      // Simulate a return value if isTokenExpired() is called
      jwtServiceSpy.isTokenExpired.and.returnValue(false);

      // Create a spy for HttpClient
      const httpSpy = jasmine.createSpyObj('HttpClient', ["post"]) ;

      // Instanciate the service manually with our spies
      const srv = new AuthService(httpSpy, jwtServiceSpy);

      const res = srv.isLoggedIn();

      expect(res).toBeFalsy();
      expect(jwtServiceSpy.isTokenExpired).toHaveBeenCalledTimes(0);
    });

});
