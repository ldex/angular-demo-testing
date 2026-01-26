import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { productsRoutes } from './products.routes';
import { productResolver } from './product.resolver';
import { of } from 'rxjs';
import { describe, it, expect, vi } from 'vitest';
import { ProductList } from './product-list/product-list';
import { ProductDetails } from './product-details/product-details';
import { Products } from './products';
import { By } from '@angular/platform-browser';

describe('Products Routes', () => {
  let router: Router;
  let harness: RouterTestingHarness;

  // Mocking product data
  const mockProduct = { id: 123, name: 'Test Product', price: 10, description: 'A product for testing' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter(productsRoutes),
        // Mock the resolver function
        { provide: productResolver, useValue: () => of(mockProduct) }
      ],
    });

    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
  });

  it('should navigate to the default child (ProductList)', async () => {
    await harness.navigateByUrl(''); // Matches path: ''
    expect(router.url).toBe('/');
    // Get the parent component (Products)
    expect(harness.routeDebugElement.componentInstance).toBeInstanceOf(Products);
    // Find the child component (ProductList) within the parent's view
    const childComponent = harness.routeDebugElement.query(By.directive(ProductList)).componentInstance;
    expect(childComponent).toBeInstanceOf(ProductList);
});

  it('should navigate to product details and resolve data', async () => {
    // Navigating to :id triggers the resolver
    await harness.navigateByUrl('/123');

    expect(router.url).toBe('/123');
    // Get the parent component (Products)
    expect(harness.routeDebugElement.componentInstance).toBeInstanceOf(Products);
    // Find the child component (ProductDetails) within the parent's view
    const childRouteElement = harness.routeDebugElement.query(By.directive(ProductDetails));
    const childComponent = childRouteElement.componentInstance;
    expect(childComponent).toBeInstanceOf(ProductDetails);

    // Verify the resolved data is actually available
    // Accessing the 'product' key from the route snapshot
    const resolvedData = childRouteElement.injector.get(ActivatedRoute).snapshot.data['product'];
    expect(resolvedData).toEqual(mockProduct);
  });
});