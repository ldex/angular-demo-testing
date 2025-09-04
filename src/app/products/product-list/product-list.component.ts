import { Observable, filter, map } from 'rxjs';
import { FavouriteService } from './../../services/favourite.service';
import { ProductService } from './../../services/product.service';
import { Product } from './../product.interface';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AsyncPipe, UpperCasePipe, JsonPipe, SlicePipe, CurrencyPipe } from '@angular/common';
import { OrderBy } from '../orderBy.pipe';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
    standalone: true,
    imports: [RouterLink, AsyncPipe, UpperCasePipe, JsonPipe, SlicePipe, CurrencyPipe, OrderBy]
})
export class ProductListComponent implements OnInit {

    title: string = "Products";
    products$: Observable<Product[]>;
    productsNumber$: Observable<number>;
    productsTotalNumber$: Observable<number>;
    selectedProduct: Product;
    sorter: string = "-modifiedDate";
    message: string = "";

    pageSize: number = 5;
    start: number = 0;
    end: number = this.pageSize;
    currentPage: number = 1;
    productsToLoad = this.pageSize * 2;

    firstPage(): void {
        this.start = 0;
        this.end = this.pageSize;
        this.currentPage = 1;
    }

    nextPage(): void {
        this.start += this.pageSize;
        this.end += this.pageSize;
        this.currentPage ++;
    }

    previousPage(): void {
        this.start -= this.pageSize;
        this.end -= this.pageSize;
        this.currentPage --;
    }

    loadMore(): void {
        let take: number = this.productsToLoad;
        let skip: number = this.end;

        this.productService.loadProducts(skip, take);
      }

    sortList(propertyName:string): void {
        this.sorter = this.sorter.startsWith("-") ? propertyName : "-" + propertyName;
        this.firstPage();
    }

    onSelect(product: Product): void {
        this.selectedProduct = product;
        this.router.navigateByUrl("/products/" + product.id);
    }

    newFavourite(product: Product): void {
        this.message = `Product
                        ${product.name}
                        added to your favourites!`;
    }

    get favourites(): number {
        return this.favouriteService.getFavouritesNb();
    }

    constructor(
        private productService: ProductService,
        private favouriteService: FavouriteService,
        private router: Router)
    {}

    ngOnInit() {
        this.products$ = this.productService.products$.pipe(filter(products => products.length > 0));
        this.productsNumber$ = this.products$.pipe(map(products => products.length))
        this.productsTotalNumber$ = this.productService.productsTotalNumber$;
    }
}