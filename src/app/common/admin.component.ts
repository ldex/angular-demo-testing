import { AdminService } from './../services/admin.service';
import { Component, inject } from '@angular/core';

@Component({
    templateUrl: './admin.component.html',
    standalone: true
})
export class AdminComponent {
    private adminService = inject(AdminService);

    profile: string = '';

    getProfile() {
        this.adminService
            .getProfile()
            .subscribe(
                response => this.profile = response
            );
    }
}