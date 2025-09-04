import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Component, DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { FormsModule } from '@angular/forms';

// Declare a mock for the Router service
class RouterMock {
    navigateByUrl() : void {}
}

describe('Login Component', () => {

    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let submitElement: DebugElement;
    let userNameElement: DebugElement;
    let passwordElement: DebugElement;
    let authServiceSpy: Spy<AuthService>;

    beforeEach(async() => {
        // refine the test module by declaring the test component
        TestBed.configureTestingModule({
    imports: [FormsModule, LoginComponent],
    providers: [
        { provide: AuthService, useValue: createSpyFromClass(AuthService) },
        { provide: Router, useClass: RouterMock }
    ]
});

        // Spy for the Auth Service
        authServiceSpy = TestBed.inject<any>(AuthService);

        // create component and test fixture
        fixture = TestBed.createComponent(LoginComponent);

        // run change detection
        fixture.detectChanges();

        // get test component from the fixture
        component = fixture.componentInstance;

        userNameElement = fixture.debugElement.query(By.css('#username'));
        passwordElement = fixture.debugElement.query(By.css('#password'));
        submitElement = fixture.debugElement.query(By.css('button'));
    });

    it('Empty username and password should disabled the submit button', () => {
        userNameElement.nativeElement.value = "";
        passwordElement.nativeElement.value = "";
        fixture.detectChanges();
        expect(submitElement.nativeElement.disabled).toBeTruthy();
        expect(component.loginForm.valid).toBeFalse();
    });

    it('Empty username should disabled the submit button', () => {
        userNameElement.nativeElement.value = "";
        passwordElement.nativeElement.value = "123456789";
        fixture.detectChanges();
        expect(submitElement.nativeElement.disabled).toBeTruthy();
    });

    it('Empty password should disabled the submit button', () => {
        userNameElement.nativeElement.value = "John";
        passwordElement.nativeElement.value = "";
        fixture.detectChanges();
        expect(submitElement.nativeElement.disabled).toBeTruthy();
    });

    it('Username validation', () => {
        let username = component.loginForm.form.controls["username"];
        expect(username.valid).toBeFalsy();
        expect(component.loginForm.valid).toBeFalsy();
        username.setValue("John");
        expect(username.valid).toBeTruthy();
    });

    it('Password validation', () => {
        let password = component.loginForm.form.controls["password"];
        expect(password.valid).toBeFalsy();
        expect(component.loginForm.valid).toBeFalsy();
        password.setValue("123456789");
        expect(password.valid).toBeTruthy();
    });

    it('Entering valid username and password should call login', () => {
        let username = component.loginForm.form.controls["username"];
        let password = component.loginForm.form.controls["password"];

        username.setValue("John");
        password.setValue("123456789");

        expect(component.loginForm.valid).toBeTrue();

        authServiceSpy.login.and.nextOneTimeWith(true);

        component.loginForm.ngSubmit.emit(null);

        expect(authServiceSpy.login).toHaveBeenCalled();
    });
});