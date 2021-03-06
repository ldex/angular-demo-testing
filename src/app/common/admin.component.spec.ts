import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminService } from '../services/admin.service';

import JasmineExpect from "jasmine-expect";
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';

import { AdminComponent } from './admin.component';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let adminServiceSpy: Spy<AdminService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminComponent],
      providers: [{ provide: AdminService, useValue: createSpyFromClass(AdminService) }]
    })

    adminServiceSpy = TestBed.inject<any>(AdminService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
