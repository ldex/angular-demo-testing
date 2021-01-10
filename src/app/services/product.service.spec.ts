import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import {ProductService} from './product.service';
import { dummyProducts } from './dummyProducts';
import { API_BASE_URL } from './const';

describe('Products Service', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const baseUrl: string = `${API_BASE_URL}/products`;

  beforeEach(() => {
    // creates a test Angular Module which we can use to instantiate components
    // perform dependency injection and so on
    TestBed.configureTestingModule({      
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    // resolve dependencies using the TestBed injector
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // After every test, assert that there are no more pending requests    service = null;
  });

  it('should get 10 products', fakeAsync(() => {

    let defaultProductsNbToGet = 10;
    
    let url = `${baseUrl}?$skip=0&$top=${defaultProductsNbToGet}&$orderby=ModifiedDate%20desc`;
    // Expect a call to this URL
    const req = httpMock.expectOne(url);
    // Assert that the request is a GET.
    expect(req.request.method).toBe("GET");
    // Respond with this data when called
    req.flush(dummyProducts);
    
    // Call tick which actually processes the response
    tick(2000);

    service.products$.subscribe(products => {
      expect(products.length).toBe(defaultProductsNbToGet);
      expect(products).toEqual(dummyProducts); // verify that there was no incorrect sorting of filtering involved
    });

  }));

});