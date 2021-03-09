import { AuthService } from './auth.service';
import { TOKENKEY } from './const';

// Tests without a TestBed
describe('Auth Service with Http and jwtHelper spies, no module setup', () => {
    const storageTokenKey: string = TOKENKEY;

    afterEach(() => {
      // Delete the local token
      localStorage.removeItem(storageTokenKey);
    });

    it('isLoggedIn() should return true if there is a token', () => {

      // Set a local token
      localStorage.setItem(storageTokenKey, '1234');

      // Create a JwtHelperService spy with a isTokenExpired method
      const jwtServiceSpy = jasmine.createSpyObj('JwtHelper', ["isTokenExpired"]) ;
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

    it('isLoggedIn() should return false if there is a no token', () => {

      // Create a JwtHelperService spy with a isTokenExpired method
      const jwtServiceSpy = jasmine.createSpyObj('JwtHelper', ["isTokenExpired"]) ;
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
