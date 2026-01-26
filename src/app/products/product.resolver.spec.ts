import { TestBed } from '@angular/core/testing';
import { productResolver } from './product.resolver';
import { ProductService } from './product-service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of, firstValueFrom, from, Observable } from 'rxjs';
import { describe, it, expect, vi } from 'vitest';
import { Product } from '../models/product';

describe('productResolver', () => {
  let productServiceMock: any;

  beforeEach(() => {
    productServiceMock = {
      getProductById: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ProductService, useValue: productServiceMock }
      ]
    });
  });

  it('should resolve a product by the id in the route params', async () => {
    const mockProduct = { id: 5, name: 'Test Desk' };
    productServiceMock.getProductById.mockReturnValue(of(mockProduct));

    // 1. Mock the ActivatedRouteSnapshot
    const mockRoute = {
      params: { id: '5' }
    } as unknown as ActivatedRouteSnapshot;

    // 2. Run the function in the injection context
    const result$ = TestBed.runInInjectionContext(() =>
        productResolver(mockRoute, {} as any)
    ) as Observable<Product>;

    // 3. Since there is a delay(1000), we wait for the observable
    const result = await firstValueFrom(result$);

    expect(result).toEqual(mockProduct);
    expect(productServiceMock.getProductById).toHaveBeenCalledWith(5);
  });
});