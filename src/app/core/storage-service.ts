import { Injectable } from '@angular/core';
import { config } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly storageTokenKey: string = config.storageTokenKey;

  storeToken(token) {
    // Store the token locally  in Local Storage (HTML5)
    // Check in Chrome Dev Tools / Application / Local Storage
    localStorage.setItem(this.storageTokenKey, token);
  }

  getToken(): string {
    return localStorage.getItem(this.storageTokenKey);
  }

   removeTokens() {
    localStorage.removeItem(this.storageTokenKey);
  }
}
