import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import {ProductService} from './product.service';
import { dummyProducts } from './dummyProducts';

describe('Products Service', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // creates a test Angular Module which we can use to instantiate components
    // perform dependency injection and so on
    TestBed.configureTestingModule({      
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ProductService
      ]
    });

    // resolve dependencies using the TestBed injector
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // assert that there are no outstanding Http requests
    service = null;
  });


  ///////////////////////////////////////////////////////////

  it('should get 5 products', (done) => { // passing the Jasmine done function to handle async code

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(5);
      expect(products).toEqual(dummyProducts); // verify that there was no sorting of filtering involved in getProducts()
      done(); // call done when async processing is complete
     });

    const req = httpMock.expectOne(`http://storerestservice.azurewebsites.net/api/products/`);
    expect(req.request.method).toBe("GET");
    req.flush(dummyProducts);

  });

});