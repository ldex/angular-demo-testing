import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Login } from './login';
import { AuthService } from '../core/auth-service';
import { By } from '@angular/platform-browser';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Login Component', () => {
  let fixture: ComponentFixture<Login>;
  let component: Login;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = { login: vi.fn() };
    routerMock = { navigateByUrl: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Login, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngAfterViewInit
  });

  it('should set focus on the username input on initialization', () => {
    const inputDebugEl = fixture.debugElement.query(By.css('#username'));
    expect(document.activeElement).toBe(inputDebugEl.nativeElement);
  });

  it('should navigate to /admin on successful login', () => {
    // Setup mock to return success
    authServiceMock.login.mockReturnValue(of(true));

    // Fill the form
    component.loginUser({
      valid: true,
      value: { username: 'admin', password: '123' }
    } as NgForm);

    expect(authServiceMock.login).toHaveBeenCalledWith('admin', '123');
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/admin');
  });

  it('should show error message on failed login', () => {
    authServiceMock.login.mockReturnValue(of(false));

    component.loginUser({
      valid: true,
      value: { username: 'wrong', password: 'bad' }
    } as NgForm);

    fixture.detectChanges();
    const errorSpan = fixture.debugElement.query(By.css('.errorMessage')).nativeElement;
    expect(errorSpan.textContent).toContain('Invalid username or password!');
  });
});