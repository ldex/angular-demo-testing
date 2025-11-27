import { Component, computed, inject, input } from '@angular/core';
import { Product } from '../../models/product';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ProductService } from '../product-service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DialogService } from '../../core/dialog-service';
import { DefaultPipe } from '../default.pipe';

@Component({
  selector: 'app-product-details',
  imports: [UpperCasePipe, CurrencyPipe, DatePipe, DefaultPipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private dialogService = inject(DialogService);
  private titleService = inject(Title);

  constructor() {
    this.titleService.setTitle(`Product Details for ${this.product()?.name}`);
  }

  private productFromResolver = toSignal(this.route.data);
  protected readonly product = computed(() => this.productFromResolver()['product']);

  // //This can't be unit tested!
  // deleteProduct(id: number) {
  //   if (window.confirm('Are you sure to delete this product ?')) {
  //     this.productService.deleteProduct(id);
  //   }
  // }

  deleteProduct(id: number) {
    this
      .dialogService
      .confirm('Are you sure to delete this product ?')
      .then(isConfirmed => {
          if (isConfirmed) {
            this.productService.deleteProduct(id);
          }
      })
  }
}
