import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProductList } from './product-list';
import { ProductService } from '../product-service';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi, Mocked } from 'vitest';
import { Product } from '../../models/product';
import { JwtHelperService } from '@auth0/angular-jwt';

describe('ProductList Component', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;

  // Mock dependencies
  let productServiceMock: any;
  let routerMock: Mocked<Router>;
  let router: Router; // Use the real Router type

  const mockProducts: Product[] = [
    { id: 1, name: 'Laptop', price: 999, description: 'Pro', discontinued: false, fixedPrice: true, modifiedDate: new Date(), imageUrl: '' },
    { id: 2, name: 'Mouse', price: 25, description: 'Wireless', discontinued: false, fixedPrice: false, modifiedDate: new Date(), imageUrl: '' },
    { id: 3, name: 'Keyboard', price: 50, description: 'Mechanical', discontinued: false, fixedPrice: true, modifiedDate: new Date(), imageUrl: '' },
  ];

  beforeEach(async () => {
    // Setup the mock signals and methods for ProductService
    productServiceMock = {
      getProducts: vi.fn().mockReturnValue(signal(mockProducts)),
      error: signal(undefined),
      isLoading: signal(false),
    };

    await TestBed.configureTestingModule({
      // Component is standalone, so we import it
      imports: [ProductList],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        provideRouter([]),
        {
          provide: JwtHelperService,
          useValue: { isTokenExpired: vi.fn(), decodeToken: vi.fn() }
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;

    // Inject the real router from the testbed
    router = TestBed.inject(Router);

    // Spy on the navigate method instead of replacing the whole object
    vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

    fixture.detectChanges(); // Trigger initial data binding
  });

  describe('Initialization', () => {
    it('should initialize with products from the service', () => {
      // Accessing protected member via casting for test verification
      const products = (component as any).products();
      expect(products).toEqual(mockProducts);
      expect(productServiceMock.getProducts).toHaveBeenCalled();
    });

    it('should have default pagination values', () => {
      expect((component as any).pageNumber()).toBe(1);
      expect((component as any).start()).toBe(0);
      expect((component as any).end()).toBe(5);
    });
  });

  describe('User Interactions', () => {
    it('should update pagination when changePage is called', () => {
      // Move to page 2
      (component as any).changePage(1);

      expect((component as any).pageNumber()).toBe(2);
      expect((component as any).start()).toBe(5);
      expect((component as any).end()).toBe(10);
      expect((component as any).selectedProduct()).toBe(null);
    });

    it('should navigate when a product is selected', () => {
      const targetProduct = mockProducts[0];

      (component as any).selectProduct(targetProduct);

      expect(router.navigate).toHaveBeenCalledWith(['/products', targetProduct.id]);
    });
  });

  describe('State Synchronization', () => {
    it('should reflect loading state from service', () => {
      productServiceMock.isLoading.set(true);
      fixture.detectChanges();
      expect((component as any).isLoading()).toBe(true);
    });

    it('should reflect error state from service', () => {
      const errorMessage = 'Failed to load';
      productServiceMock.error.set(errorMessage);
      fixture.detectChanges();
      expect((component as any).error()).toBe(errorMessage);
    });
  });
});