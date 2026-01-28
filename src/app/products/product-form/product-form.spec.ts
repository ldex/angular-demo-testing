import { TestBed } from '@angular/core/testing';
import { ProductForm } from './product-form';
import { ProductService } from '../product-service';
import { Router } from '@angular/router';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

describe('ProductForm', () => {
  let component: ProductForm;

  let productServiceMock: { createProduct: ReturnType<typeof vi.fn> };
  let routerMock: { navigateByUrl: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    productServiceMock = {
      createProduct: vi.fn(() => Promise.resolve()),
    };

    routerMock = {
      navigateByUrl: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ProductForm, // Why providers instead of imports? In this specific case, ProductForm is treated as a plain TypeScript class rather than a UI Component.
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    component = TestBed.inject(ProductForm); // We are simply asking the Angular Injector to "new up" the class and resolve its dependencies (Router, etc.) as we are not testing anything HTML related.
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('verify name field validity', () => {
    let name = component.productForm.name();
    expect(name.valid()).toBeFalsy();

    // Set name to something incorrect (empty)
    name.value.set("")
    expect(name.valid()).toBeFalsy();
    expect(name.errors().find(error => error.kind === "required")).toBeTruthy();

    // Set name to something incorrect (too short)
    name.value.set("a")
    expect(name.valid()).toBeFalsy();
    expect(name.errors().find(error => error.kind === "minLength")).toBeTruthy();

    // Set name to something incorrect (too long)
    name.value.set('x'.repeat(51))
    expect(name.valid()).toBeFalsy();
    expect(name.errors().find(error => error.kind === "maxLength")).toBeTruthy();

    // Set name to something correct
    name.value.set("this name is ok.")
    expect(name.valid()).toBeTruthy();
    expect(name.errors().find(error => error.kind === "required")).toBeFalsy();
    expect(name.errors().find(error => error.kind === "minLength")).toBeFalsy();
    expect(name.errors().find(error => error.kind === "maxLength")).toBeFalsy();
  });


  it('submits valid form: calls createProduct and navigates to /products', async () => {
    // arrange: put a valid product into the component signal
    (component as unknown as any).product.set({
      name: 'Valid Name',
      description: 'A valid description',
      discontinued: false,
      fixedPrice: false,
      price: 42,
      modifiedDate: new Date(),
      imageUrl: 'https://example.com/image.jpg',
    });

    // act
    const ret = component.submitForm();
    expect(ret).toBe(false); // submitForm returns false to prevent reload

    // wait for microtasks so the async submit handler can run and await createProduct
    await Promise.resolve();

    // assert
    expect(productServiceMock.createProduct).toHaveBeenCalled();
    expect(productServiceMock.createProduct).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Valid Name', price: 42 })
    );
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/products');
  });

  it('does not submit invalid form: createProduct and navigation are not called', async () => {
    // arrange: make name too short so validation fails
    (component as unknown as any).product.set({
      name: 'ab', // minLength = 3
      description: 'short',
      discontinued: false,
      fixedPrice: false,
      price: 0,
      modifiedDate: new Date(),
      imageUrl: '',
    });

    // act
    component.submitForm();

    // wait microtasks in case submit attempts anything
    await Promise.resolve();

    // assert
    expect(productServiceMock.createProduct).not.toHaveBeenCalled();
    expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
  });
});