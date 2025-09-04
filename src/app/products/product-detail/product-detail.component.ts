import { ProductService } from './../../services/product.service';
import { FavouriteService } from './../../services/favourite.service';
import { Product } from './../product.interface';
import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { AsyncPipe, UpperCasePipe, CurrencyPipe, DatePipe } from '@angular/common';
import { DefaultPipe } from '../default.pipe';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css'],
    standalone: true,
    imports: [AsyncPipe, UpperCasePipe, CurrencyPipe, DatePipe, DefaultPipe]
})
export class ProductDetailComponent implements OnInit {
  private favouriteService = inject(FavouriteService);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);


  product$: Observable<Product>;
  productSub: Subscription;

  @Output() favouriteAdded = new EventEmitter<Product>();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() { }

  // deleteProductNotTestable(id: number) {
  //   if (window.confirm('Are you sure to delete this product ?')) {
  //     this.productService
  //         .deleteProduct(id)
  //         .subscribe(
  //             () => {
  //                 console.log('Product deleted.');
  //                 this.productService.clearList();
  //                 this.router.navigateByUrl("/products");
  //             },
  //             error => console.log('Could not delete product. ' + error),
  //             () => console.log('Delete Product Complete.')
  //         );
  //   }
  // }

  deleteProduct(id: number) {
    this
      .dialogService
      .confirm('Are you sure to delete this product ?')
      .then(isConfirmed => {
          if (isConfirmed) {
            this.productService
                .deleteProduct(id)
                .subscribe(
                  {
                    next: () => {
                      console.log('Product deleted.');
                      this.productService.clearList();
                      this.router.navigateByUrl("/products");
                    },
                    error: (error) => console.log('Could not delete product. ' + error),
                    complete: () => console.log('Delete Product Complete.')
                  }
                );
          }
        }
      )
  }

  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  addToFavourites(product: Product) {
    this.favouriteAdded.emit(product);
    this.favouriteService.addToFavourites(product);
  }

  ngOnInit() {
    let id = this.route.snapshot.params["id"];
    if (id) {
        this.product$ = this.productService.getProductById(id);
    }
  }

}
