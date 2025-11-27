import { inject } from '@angular/core';
import { ProductService } from './product-service';
import { Product } from '../models/product';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { delay } from 'rxjs';

export const productResolver: ResolveFn<Product> = (route: ActivatedRouteSnapshot) => {
   const productService = inject(ProductService);
   const id = +route.params['id'];
   return productService.getProductById(id).pipe(delay(1000)); // Simulating network delay
};
