import { Product } from './../products/product.interface';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { config } from 'src/environments/environment';
import { BehaviorSubject, Observable, throwError, first, shareReplay, delay, mergeMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
    private http = inject(HttpClient);


    private baseUrl: string = `${config.apiUrl}/products`;

    private products = new BehaviorSubject<Product[]>([]);
    products$: Observable<Product[]> = this.products.asObservable();
    productsTotalNumber$: BehaviorSubject<number> = new BehaviorSubject(0);
    productsToLoad = 10;

    constructor() {
        this.loadProducts();
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    insertProduct(newProduct: Product): Observable<Product> {
        newProduct.modifiedDate = new Date();
        return this.http.post<Product>(this.baseUrl, newProduct);
    }

    getProductById(id: number): Observable<Product> {
        return this.products$.pipe(
          mergeMap(p => p),
          first(product => product.id == id)
        );
    }

    loadProducts(skip: number = 0, take: number = this.productsToLoad): void {
        if (skip == 0 && this.products.value.length > 0) return;

        const params = {
            _start: skip,
            _limit: take,
            _sort: 'modifiedDate',
            _order: 'desc'
        }

        const options = {
          params: params,
          observe: 'response' as 'response' // in order to read params from the response header
        };

        this.http
          .get(this.baseUrl, options)
          .pipe(
           // delay(500),
            tap(response => {
              let count = response.headers.get('X-Total-Count') // total number of products
              if(count)
                this.productsTotalNumber$.next(Number(count))
            }),
            shareReplay()
          )
          .subscribe((response: HttpResponse<Product[]>) => {
            let newProducts = response.body;
            let currentProducts = this.products.value;
            let mergedProducts = currentProducts.concat(newProducts);
            this.products.next(mergedProducts);
          });
      }

    clearList() {
        this.products.next([]);
        this.loadProducts();
    }
}