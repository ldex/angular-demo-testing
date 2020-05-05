import { Product } from './../products/product.interface';
import { Injectable } from '@angular/core';

@Injectable()
export class FavouriteService {

    constructor() { }

    get favourite() {
        return this._favourites;
    }

    private _favourites: Set<Product> = new Set();
    get favourites(): Set<Product> {
        return this._favourites;
    }

    addToFavourites(product: Product): void {
       this._favourites.add(product);
    }

    getFavouritesNb() : number {
        return this._favourites.size;
    }
}