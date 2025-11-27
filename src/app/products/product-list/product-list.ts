import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Product } from '../../models/product';
import { CurrencyPipe, JsonPipe, SlicePipe, UpperCasePipe } from '@angular/common';
import { ProductService } from '../product-service';
import { OrderByPipe } from '../orderBy.pipe';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [UpperCasePipe, CurrencyPipe, OrderByPipe, JsonPipe, SlicePipe, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {

  private productService = inject(ProductService);
  private router = inject(Router);

  protected products = this.productService.getProducts();
  protected selectedProduct = signal<Product>(undefined);
  protected error = this.productService.error;
  protected isLoading = this.productService.isLoading;

  private pageSize = signal(5);
  protected start = signal(0);
  protected end = signal(this.pageSize());
  protected pageNumber = signal(1);

  protected changePage(increment: number) {
    this.pageNumber.update(p => p + increment);
    this.start.update(n => n + increment * this.pageSize());
    this.end.set(this.start() + this.pageSize());
    this.selectedProduct.set(null);
  }

  protected selectProduct(product: Product) {
    this.selectedProduct.set(product);
    this.router.navigate(['/products', product.id]);
  }
}
