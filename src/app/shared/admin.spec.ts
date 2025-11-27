import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Admin } from './admin';
import { ApiService } from '../core/api-service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

describe('Admin component', () => {
  let fixture: ComponentFixture<Admin>;
  let component: Admin;
  let apiMock: { getUserProfile: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    apiMock = {
      getUserProfile: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [Admin],
      providers: [{ provide: ApiService, useValue: apiMock }],
    });

    fixture = TestBed.createComponent(Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initial profile signal is empty and rendered in template', () => {
    const h2Elements = fixture.debugElement.queryAll(By.css('h2'));
    // first h2 is the static "Admin" title, second h2 renders profile()
    expect(h2Elements.length).toBeGreaterThanOrEqual(2);
    const profileText = h2Elements[1].nativeElement.textContent.trim();
    expect(profileText).toBe('');
  });

  it('getProfile calls ApiService.getUserProfile and updates profile signal and DOM', () => {
    apiMock.getUserProfile.mockReturnValue(of('Alice'));

    component.getProfile();
    fixture.detectChanges();

    expect(apiMock.getUserProfile).toHaveBeenCalled();
    expect((component as any).profile()).toBe('Alice');

    const h2Elements = fixture.debugElement.queryAll(By.css('h2'));
    const rendered = h2Elements[1].nativeElement.textContent.trim();
    expect(rendered).toBe('Alice');
  });

  it('button click triggers getProfile and updates profile', () => {
    apiMock.getUserProfile.mockReturnValue(of('Bob'));
    const btn = fixture.debugElement.query(By.css('button'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(apiMock.getUserProfile).toHaveBeenCalled();
    expect((component as any).profile()).toBe('Bob');

    const h2Elements = fixture.debugElement.queryAll(By.css('h2'));
    expect(h2Elements[1].nativeElement.textContent.trim()).toBe('Bob');
  });
});