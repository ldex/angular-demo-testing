import { Router } from '@angular/router';
import { Component, ViewChild, AfterViewInit, ElementRef, inject } from '@angular/core';
import { NgForm, FormsModule } from "@angular/forms";
import { AuthService } from '../core/auth-service';

@Component({
    template: `
        <h2>Login</h2>
        <form #loginForm="ngForm" (ngSubmit)="loginUser(loginForm)" style="margin-bottom: 80px">
        <label for="username">Username</label>
        <input type="text" name="username" #username id="username" required ngModel autofocus autocomplete="off">
        <br /><br />
        <label for="password">Password</label>
        <input type="password" name="password" id="password" required ngModel autocomplete="off">
        <br /><br />
        <button type="submit" [disabled]="loginForm.invalid">Login</button>
        <br />
        <span class="errorMessage">{{error}}</span>
        </form>
    `,
    styles: `
        label {
            width: 100px;
            display:inline-block;
        }

        button {
            margin-left: 100px;
        }
    `,
    imports: [FormsModule]
})
export class Login implements AfterViewInit {
    error = '';

    private authService = inject(AuthService);
    private router = inject(Router);

    loginUser(form: NgForm) {
        if (form.valid) {
            this.authService
                .login(form.value.username, form.value.password)
                .subscribe(
                    result => {
                        if (result) {
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

    @ViewChild('username') myInput!: ElementRef;

    setFocus() {
        this.myInput.nativeElement.focus();
    }
}