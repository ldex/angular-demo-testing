import { Observable } from 'rxjs';
import { FavouriteService } from './../../services/favourite.service';
import { ProductService } from './../../services/product.service';
import { Product } from './../product.interface';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

    title: string = "Products";
    products$: Observable<Product[]>;
    selectedProduct: Product;
    sorter: string = "-modifiedDate";
   
    pageSize: number = 5;
    start: number = 0;
    end: number = this.pageSize;
    currentPage: number = 1;

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

    loadMore() : void {
        let take: number = this.pageSize * 2;
        let skip: number = this.end + 1;
        this.products$ = this.productService.getMoreProducts(skip, take);
    }

    sortList(propertyName:string): void {
        this.sorter = this.sorter.startsWith("-") ? propertyName : "-" + propertyName;
        this.firstPage();
    }

    onSelect(product: Product): void {
        this.selectedProduct = product;
        this.router.navigateByUrl("/products/" + product.id);
    }

    message: string = "";

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
        this.products$ = this.productService.getProducts();
    }
}