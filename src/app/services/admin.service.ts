import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from "rxjs/operators";

@Injectable()
export class AdminService {

  constructor(private http: HttpClient) { }

  private baseUrl: string = 'http://your_rest_api.net/api/profile';
  private storageKey: string = 'auth_token';

  getProfile(): Observable<string> {

    const authToken = localStorage.getItem(this.storageKey);
    const headers = {'Authorization': `Bearer ${authToken}` };
    const demo = true;

    if(demo) {

      // Demo mode
      return of('Secured info!');

    } else {

      // Real server call here!
      return this
              .http
              .get<string>(this.baseUrl, { headers });
    }
  }

}
