import { ComponentFixture, TestBed } from '@angular/core/testing';

import JasmineExpect from "jasmine-expect";

import { ErrorComponent } from './error.component';
import { ActivatedRoute } from '@angular/router';

// Declare a mock for the ActivatedRoute service
class ActivatedRouteMock {
    snapshot = {
        queryParams: {}
    }
}

describe('Error Component', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  let service: ActivatedRouteMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [ErrorComponent],
        providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteMock }]
    })

    service = TestBed.inject<any>(ActivatedRoute);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    service = null;
    component = null;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should have default message without reason route parameter', () => {
    expect(component.message).toBeEmptyString();
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.message).toBe('none');
  });

  it('should set message with reason route parameter', () => {
    let result: string = 'testing';
    service.snapshot.queryParams['reason'] = result;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.message).toBe(result);
  });
});
