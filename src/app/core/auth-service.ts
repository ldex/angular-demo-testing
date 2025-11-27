import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from './api-service';
import { StorageService } from './storage-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = signal(false);

  private apiService = inject(ApiService);
  private jwtHelper = inject(JwtHelperService);
  private storageService = inject(StorageService);

  login(username: string, password: string) {
    return this.apiService.login(username, password).pipe(
      map((response) => {
        if (response.error) {
          console.error(response.error);
          return false;
        } else {
          this.storageService.storeToken(response.token);
          this.loggedIn.set(true);
          console.info('Login successful, token stored');
          return true;
        }
      }),
      catchError((err) => {
        console.error('Login error ', err);
        return of(false);
      })
    );
  }

  logout(): void {
    this.storageService.removeTokens();
    this.loggedIn.set(false);
    console.info('User logged out, token removed');
  }

  isLoggedIn = computed(() => {
    const token: string = this.storageService.getToken();
    if (this.loggedIn() && token != null) {
      return !this.jwtHelper.isTokenExpired(token);
    } else {
      return false;
    }
  });
}
