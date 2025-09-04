import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminService } from '../services/admin.service';

import JasmineExpect from "jasmine-expect";
import { Spy, createSpyFromClass, provideAutoSpy } from 'jasmine-auto-spies';

import { AdminComponent } from './admin.component';

describe('Admin Component', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let adminServiceSpy: Spy<AdminService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [AdminComponent],
    providers: [provideAutoSpy(AdminService)]
})

    adminServiceSpy = TestBed.inject<any>(AdminService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have empty profile', () => {
    expect(component.profile).toBeEmptyString();
  });

  it('should get profile', () => {
    let result: string = 'test';
    adminServiceSpy.getProfile.and.nextOneTimeWith(result);
    component.getProfile();
    expect(component.profile).toBe(result);
    expect(adminServiceSpy.getProfile).toHaveBeenCalled();
  });
});
