import { ProductService } from './../../services/product.service';
import { FavouriteService } from './../../services/favourite.service';
import { Product } from './../product.interface';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product$: Observable<Product>;
  productSub: Subscription;

  @Output() favouriteAdded = new EventEmitter<Product>();

  constructor(
    private favouriteService: FavouriteService,
    private productService: ProductService,
    private authService: AuthService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

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
                    () => {
                        console.log('Product deleted.');
                        this.productService.clearList();
                        this.router.navigateByUrl("/products");
                    },
                    error => console.log('Could not delete product. ' + error),
                    () => console.log('Delete Product Complete.')
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
