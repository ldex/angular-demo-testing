import { TestBed } from '@angular/core/testing';
import { ProductService } from './product-service';
import { ApiService } from '../core/api-service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError, firstValueFrom } from 'rxjs';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

describe('ProductService', () => {
  let service: ProductService;
  let apiMock: {
    getProducts: ReturnType<typeof vi.fn>;
    getProductById: ReturnType<typeof vi.fn>;
    createProduct: ReturnType<typeof vi.fn>;
    deleteProduct: ReturnType<typeof vi.fn>;
  };
  let routerMock: { navigateByUrl: ReturnType<typeof vi.fn> };

  const mockProducts = [
    { id: 1, name: 'P1', price: 10 },
    { id: 2, name: 'P2', price: 20 },
  ];

  beforeEach(() => {
    apiMock = {
      getProducts: vi.fn(),
      getProductById: vi.fn(),
      createProduct: vi.fn(),
      deleteProduct: vi.fn(),
    };

    routerMock = {
      navigateByUrl: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: ApiService, useValue: apiMock as unknown as ApiService },
        { provide: Router, useValue: routerMock as unknown as Router },
      ],
    });

    service = TestBed.inject(ProductService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('getProductById returns product from cache when cache populated', async () => {
    (service as unknown as { productsCache: { set: (p: typeof mockProducts) => void } })
      .productsCache.set(mockProducts);

    const product = await firstValueFrom(service.getProductById(1));
    expect(product).toEqual(mockProducts[0]);
    expect(apiMock.getProductById).not.toHaveBeenCalled();
  });

  it('getProductById calls api when cache empty', async () => {
    apiMock.getProductById.mockReturnValue(of(mockProducts[0]));

    const product = await firstValueFrom(service.getProductById(1));
    expect(product).toEqual(mockProducts[0]);
    expect(apiMock.getProductById).toHaveBeenCalledWith(1);
  });

  it('getProducts returns cached signal when cache populated', () => {
    (service as unknown as { productsCache: { set: (p: typeof mockProducts) => void } })
      .productsCache.set(mockProducts);

    const sig = service.getProducts();
    expect(sig()).toEqual(mockProducts);
    expect(apiMock.getProducts).not.toHaveBeenCalled();
  });

  it('getProducts fetches from api and updates cache & loading', async () => {
    apiMock.getProducts.mockReturnValue(of(mockProducts));

    const sig = service.getProducts();
    // subscribe runs synchronously for of(), so state should be updated already
    expect(apiMock.getProducts).toHaveBeenCalled();
    expect(service.isLoading()).toBe(false);
    expect(sig()).toEqual(mockProducts);
  });

  it('getProducts handles api error and sets error signal', () => {
    const httpErr = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
    apiMock.getProducts.mockReturnValue(throwError(() => httpErr));

    const sig = service.getProducts();
    expect(service.isLoading()).toBe(false);
    expect(service.error()).toBe('Failed to load products.');
    // signal value remains default array
    expect(sig()).toEqual([]);
  });

  it('createProduct appends created product to cache on success', async () => {
    (service as unknown as { productsCache: { set: (p: typeof mockProducts) => void } })
      .productsCache.set([mockProducts[0]]);

    const newProduct = { name: 'New', price: 5 } as any;
    const created = { id: 3, ...newProduct };

    apiMock.createProduct.mockReturnValue(of(created));

    await service.createProduct(newProduct);
    const cache = (service as unknown as { productsCache: () => typeof mockProducts }).productsCache();
    expect(cache).toContainEqual(created);
    expect(apiMock.createProduct).toHaveBeenCalledWith(newProduct);
  });

  it('createProduct sets error when api fails', async () => {
    const httpErr = new HttpErrorResponse({ status: 400 });
    apiMock.createProduct.mockReturnValue(throwError(() => httpErr));

    await service.createProduct({ name: 'Bad', price: 0 } as any);
    expect(service.error()).toBe('Failed to save product.');
  });

  it('deleteProduct removes product from cache and navigates on success', () => {
    (service as unknown as { productsCache: { set: (p: typeof mockProducts) => void } })
      .productsCache.set(mockProducts);

    apiMock.deleteProduct.mockReturnValue(of(void 0));

    service.deleteProduct(1);
    const cache = (service as unknown as { productsCache: () => typeof mockProducts }).productsCache();
    expect(cache).toEqual([mockProducts[1]]);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/products');
  });

  it('deleteProduct sets error when api fails', () => {
    const httpErr = new HttpErrorResponse({ status: 404 });
    apiMock.deleteProduct.mockReturnValue(throwError(() => httpErr));

    service.deleteProduct(1);
    expect(service.error()).toBe('Failed to delete product.');
  });

  it('handleError logs client ErrorEvent and sets user message', () => {
    const errEvent = new ErrorEvent('Network', { message: 'offline' });
    const httpErr = new HttpErrorResponse({ error: errEvent });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    (service as unknown as { handleError: (e: HttpErrorResponse, m: string) => void })
      .handleError(httpErr, 'Client error');

    expect(service.error()).toBe('Client error');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('handleError logs server error and sets loading false', () => {
    (service as unknown as { loading: { set: (v: boolean) => void } }).loading.set(true);
    const httpErr = new HttpErrorResponse({ status: 500, error: 'boom' });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    (service as unknown as { handleError: (e: HttpErrorResponse, m: string) => void })
      .handleError(httpErr, 'Server error');

    expect(service.isLoading()).toBe(false);
    expect(service.error()).toBe('Server error');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});