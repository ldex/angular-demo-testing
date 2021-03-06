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
    let loginElement: DebugElement;
    let passwordElement: DebugElement;
    let authServiceSpy: Spy<AuthService>;

    beforeEach(async() => {
        // refine the test module by declaring the test component
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [LoginComponent],
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

        loginElement = fixture.debugElement.query(By.css('#username'));
        passwordElement = fixture.debugElement.query(By.css('#password'));
        submitElement = fixture.debugElement.query(By.css('button'));
    });

    it('Empty username and password should disabled the submit button', () => {
        loginElement.nativeElement.value = "";
        passwordElement.nativeElement.value = "";
        fixture.detectChanges();
        expect(submitElement.nativeElement.disabled).toBeTruthy();
        expect(component.loginForm.valid).toBeFalse();
    });

    it('Empty username should disabled the submit button', () => {
        loginElement.nativeElement.value = "";
        passwordElement.nativeElement.value = "123456789";
        fixture.detectChanges();
        expect(submitElement.nativeElement.disabled).toBeTruthy();
    });
    
    it('Empty password should disabled the submit button', () => {
        loginElement.nativeElement.value = "John";
        passwordElement.nativeElement.value = "";
        fixture.detectChanges();
        expect(submitElement.nativeElement.disabled).toBeTruthy();
    });

    it('Entering valid username and password should call login', () => {
        loginElement.nativeElement.value = "John";
        passwordElement.nativeElement.value = "12345678";
        fixture.detectChanges();

        expect(component.loginForm.valid).toBeTrue();
        
        authServiceSpy.login.and.nextOneTimeWith(true);

        // This sync emits the event and the subscribe callback gets executed above
        submitElement.triggerEventHandler('click', null);
        
        fixture.detectChanges();
       
        expect(authServiceSpy.login).toHaveBeenCalled();
    });
});