import { Router } from '@angular/router';
import { LoginService } from './../services/login.service';
import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { NgForm } from "@angular/forms";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

    error: string = '';

    constructor(
        private loginService: LoginService,
        private router: Router
    ) { }

    loginUser(form: NgForm) {
        if (form.valid) {
            this.loginService
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

    setFocus() {
        this.myInput.nativeElement.focus();
    }
}