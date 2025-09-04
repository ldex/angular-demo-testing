import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { dummyProducts } from './dummyProducts';
import { API_BASE_URL } from './const';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('Products Service', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const baseUrl: string = `${API_BASE_URL}/products`;

  beforeEach(() => {
    // creates a test Angular Module which we can use to instantiate components
    // perform dependency injection and so on
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ProductService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    // resolve dependencies using the TestBed injector
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    service = null;
  });

  it('should get 10 products', () => {
    let defaultProductsNbToGet = 10;

    let url = `${baseUrl}?_start=0&_limit=${defaultProductsNbToGet}&_sort=modifiedDate&_order=desc`;

    let actualProducts;
    service.products$.subscribe((products) => (actualProducts = products));

    // Expect a call to this URL
    const req = httpMock.expectOne(url);
    // Assert that the request is a GET.
    expect(req.request.method).toBe('GET');
    // Respond with this data when called
    req.flush(dummyProducts);

    expect(actualProducts.length).toBe(defaultProductsNbToGet);
    expect(actualProducts).toEqual(dummyProducts); // verify that there was no incorrect sorting of filtering involved
  });

  it('should delete product', () => {
    const productId = 1;

    service.deleteProduct(productId).subscribe();

    let url = `${baseUrl}/${productId}`;

    // Expect a call to this URL
    const req = httpMock.expectOne(url);
    // Assert that the request is a GET.
    expect(req.request.method).toBe('DELETE');
    // Respond with this data when called
    req.flush({});
  });
});
