import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ApiService } from '../core/api-service';
import { Product } from '../models/product';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { lastValueFrom, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  private productsCache = signal<Product[]>([]);
  private loading = signal(false);
  readonly isLoading = this.loading.asReadonly();
  error = signal<string>(undefined);

  // Returning an observable because the resolver API is still observable-based
  getProductById(id: number): Observable<Product | undefined> {
    if (this.productsCache().length > 0) {
      // Getting product from cache
      return of(this.productsCache().find((p) => p.id == id));
    }
    // Loading product from server
    return this.apiService.getProductById(id);
  }

  getProducts() {
    if (this.productsCache().length > 0) {
      return this.productsCache;
    }

    this.loading.set(true);
    this.apiService.getProducts().subscribe({
      next: (products) => {
        this.productsCache.set(products);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.handleError(error, 'Failed to load products.');
      },
    });
    return this.productsCache;
  }

  async createProduct(newProduct: Omit<Product, 'id'>): Promise<Product> {
    this.loading.set(true);
    this.error.set(undefined);

    try {
      // 1. Convert Observable to Promise and await it
      const product = await lastValueFrom(this.apiService.createProduct(newProduct));

      // 2. Perform side effects (update cache)
      this.productsCache.update((products) => [...products, product]);
      this.loading.set(false);

      return product;
    } catch (err) {
      // 3. Handle error through our existing helper
      this.handleError(err as HttpErrorResponse, 'Failed to save product.');

      // 4. Re-throw so the component knows the operation failed
      throw err;
    }
  }

  createProduct_old(newProduct: Omit<Product, 'id'>): Promise<void> {
    this.apiService.createProduct(newProduct).subscribe({
      next: (product) => {
        this.productsCache.update((products) => [...products, product]);
        console.log('Product saved on the server with id: ' + product.id);
      },
      error: (error) => {
        this.handleError(error, 'Failed to save product.');
        return Promise.reject();
      },
    });
    return Promise.resolve();
  }

  deleteProduct(id: number) {
    this.apiService.deleteProduct(id).subscribe({
      next: () => {
        this.productsCache.update((products) => products.filter((p) => p.id !== id));
        console.log('Product deleted');
        this.router.navigateByUrl('/products');
      },
      error: (error) => this.handleError(error, 'Failed to delete product.'),
    });
  }

  private handleError(httpError: HttpErrorResponse, userMessage: string) {
    this.loading.set(false);
    let logMessage: string;
    if (httpError.error instanceof ErrorEvent) {
      logMessage = 'An error occurred:' + httpError.error.message;
    } else {
      logMessage = `Backend returned code ${httpError.status}, body was: ${httpError.error}`;
    }
    console.error(logMessage);
    this.error.set(userMessage);
  }
}
