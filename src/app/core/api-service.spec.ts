import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api-service';
import { StorageService } from './storage-service';
import { firstValueFrom } from 'rxjs';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { config } from '../../environments/environment';
import { Product } from '../models/product';

describe('ApiService', () => {
  let service: ApiService;
  let httpCtrl: HttpTestingController;
  let storageStub: Partial<StorageService>;

  const mockProducts = [
    { id: 1, name: 'P1', price: 10 },
    { id: 2, name: 'P2', price: 20 },
  ];

  beforeEach(() => {
    storageStub = { getToken: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: StorageService, useValue: storageStub },
      ],
    });

    service = TestBed.inject(ApiService);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpCtrl.verify();
    vi.restoreAllMocks();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('getProducts should GET products and respect delay', async () => {
    vi.useFakeTimers();
    const resultPromise = firstValueFrom(service.getProducts());

    const req = httpCtrl.expectOne(config.productsApiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);

    // advance the delay applied in the service
    vi.advanceTimersByTime(1000);
    // allow microtasks to resolve
    await Promise.resolve();

    const products = await resultPromise;
    expect(products).toEqual(mockProducts);
  });

  it('getProductById should GET product by id', async () => {
    const id = 1;
    const product = mockProducts[0];
    const resultPromise = firstValueFrom(service.getProductById(id));

    const req = httpCtrl.expectOne(config.productsApiUrl + id);
    expect(req.request.method).toBe('GET');
    req.flush(product);

    const res = await resultPromise;
    expect(res).toEqual(product);
  });

  it('createProduct should POST product and return created product', async () => {
    const newProduct: Omit<Product, 'id'> = { name: 'New', price: 5, description: 'test', modifiedDate: new Date(), imageUrl: 'test', fixedPrice: false, discontinued: false };
    const created = { id: 3, ...newProduct };
    const resultPromise = firstValueFrom(service.createProduct(newProduct));

    const req = httpCtrl.expectOne(config.productsApiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(created);

    const res = await resultPromise;
    expect(res).toEqual(created);
  });

  it('deleteProduct should DELETE product by id', async () => {
    const id = 2;
    const resultPromise = firstValueFrom(service.deleteProduct(id));

    const req = httpCtrl.expectOne(config.productsApiUrl + id);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    const res = await resultPromise;
    expect(res).toBeNull();
  });

  it('getUserProfile should use token from StorageService and map profile', async () => {
    const token = 'token-xyz';
    const profile = { name: 'Alice' };
    (storageStub.getToken as ReturnType<typeof vi.fn>).mockReturnValue(token);

    const resultPromise = firstValueFrom(service.getUserProfile());

    const req = httpCtrl.expectOne(config.adminApiUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush({ profile });

    const res = await resultPromise;
    expect(res).toEqual(profile);
  });

  it('login should POST credentials to auth API and return auth response', async () => {
    const authResp = { token: 't', user: { id: 1 } };
    const resultPromise = firstValueFrom(service.login('me@x', 'pwd'));

    const req = httpCtrl.expectOne(config.authApiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'me@x', password: 'pwd' });
    req.flush(authResp);

    const res = await resultPromise;
    expect(res).toEqual(authResp);
  });
});