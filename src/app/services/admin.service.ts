import { config } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable, of } from 'rxjs';

@Injectable()
export class AdminService {
  private http = inject(HttpClient);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() { }

  private baseUrl: string = config.adminApiUrl;

  getProfile(): Observable<string> {

      // Authorization token will be automatically sent to the server in the Http Headers with an interceptor
      // (auth-interceptor or automatically via the angular-jwt library)
      return this
        .http
        .get<any>(this.baseUrl)
        .pipe(
          map(response => response.profile)
        );
  }

}
