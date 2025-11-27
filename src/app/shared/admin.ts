import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../core/api-service';

@Component({
    selector: 'app-admin',
    template: `
        <h2>Admin</h2>
        <div style="margin-bottom: 80px">
            <p>
                Welcome to the admin area. Only authorized users can access this section.
            </p>
            <p>
                <button (click)="getProfile()">Get user profile (passing auth token)</button>
            </p>
            <h2>{{ profile() }}</h2>
        </div>
    `,
})
export class Admin {
    private readonly apiService = inject(ApiService);
    profile = signal('');

    getProfile() {
        this.apiService
            .getUserProfile()
            .subscribe(
                response => this.profile.set(response)
            );
    }

}