import { Product } from './../products/product.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { config } from 'src/environments/environment';
import { BehaviorSubject, Observable, throwError, first, shareReplay, delay, mergeMap } from 'rxjs';

@Injectable()
export class ProductService {

    private baseUrl: string = `${config.apiUrl}/products`;

    private products = new BehaviorSubject<Product[]>([]);
    products$: Observable<Product[]> = this.products.asObservable();
    productsTotalNumber$: Observable<number>;

    constructor(private http: HttpClient) {
        this.loadProducts();
        this.initProductsTotalNumber();
    }

    deleteProduct(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }

    insertProduct(newProduct: Product): Observable<Product> {
        return this.http.post<Product>(this.baseUrl, newProduct);
    }

    getProductById(id: number): Observable<Product> {
        return this.products$.pipe(
          mergeMap(p => p),
          first(product => product.id == id)
        );
    }

    private initProductsTotalNumber() {
        this.productsTotalNumber$ =
            this
            .http
            .get<number>(this.baseUrl + "/count")
            .pipe(
                shareReplay()
            );
    }

    loadProducts(skip: number = 0, take: number = 10): void {
        let url = `${this.baseUrl}?$skip=${skip}&$top=${take}&$orderby=ModifiedDate%20desc`;

        if (skip == 0 && this.products.value.length > 0) return;

        this.http
          .get<Product[]>(url)
          .pipe(
            delay(1000),
            shareReplay()
          )
          .subscribe(products => {
            let currentProducts = this.products.value;
            let mergedProducts = currentProducts.concat(products);
            this.products.next(mergedProducts);
          });
    }

    clearList() {
        this.products.next([]);
        this.loadProducts();
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMsg: string;
        if (errorResponse.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMsg = 'An error occurred:' + errorResponse.error.message;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMsg = `Backend returned code ${errorResponse.status}, body was: ${errorResponse.error}`;
        }
        console.error(errorMsg);
        return throwError(errorMsg);
    }
}