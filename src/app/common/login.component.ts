import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Component, ViewChild, AfterViewInit, ElementRef, inject } from '@angular/core';
import { NgForm, FormsModule } from "@angular/forms";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: true,
    imports: [FormsModule]
})
export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);


    error: string = '';

    /** Inserted by Angular inject() migration for backwards compatibility */
    constructor(...args: unknown[]);

    constructor() { }

    loginUser(form: NgForm) {
        if (form.valid) {
            this.authService
                .login(form.value.username, form.value.password)
                .subscribe(
                    result => {
                        if(result) {
                            this.router.navigateByUrl('/admin');
                        } else {
                            this.error = 'Invalid username or password!';
                        }
                    }
                );
        }
    }

    ngAfterViewInit(): void {
        this.setFocus();
    }

    @ViewChild('username') myInput: ElementRef;
    @ViewChild('loginForm') loginForm: NgForm;

    setFocus() {
        this.myInput.nativeElement.focus();
    }
}