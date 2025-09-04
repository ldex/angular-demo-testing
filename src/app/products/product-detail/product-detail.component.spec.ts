import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../product.interface';
import { ProductDetailComponent } from "./product-detail.component";
import { Spy, createSpyFromClass, provideAutoSpy } from 'jasmine-auto-spies';
import { ActivatedRoute, Router } from '@angular/router';
import { FavouriteService } from 'src/app/services/favourite.service';
import { AuthService } from 'src/app/services/auth.service';
import { DefaultPipe } from '../default.pipe';
import { DialogService } from 'src/app/services/dialog.service';

// Declare a mock for the ActivatedRoute service
class ActivatedRouteMock {
    snapshot = {
        params: {}
    }
}

describe('Product Detail Component', () => {
    let component: ProductDetailComponent;
    let fixture: ComponentFixture<ProductDetailComponent>;
    let productServiceSpy: Spy<ProductService>;
    let favouriteServiceSpy: Spy<FavouriteService>;
    let authServiceSpy: Spy<AuthService>;
    let dialogServiceSpy: Spy<DialogService>;
    let routerServiceSpy: Spy<Router>;
    let activatedRouteServiceMock: ActivatedRouteMock;
    let fakeProduct;

    beforeEach(() => {
        // refine the test module by declaring the test component
        TestBed.configureTestingModule({
    imports: [ProductDetailComponent, DefaultPipe],
    providers: [
        provideAutoSpy(ProductService), // same as { provide: ProductService, useValue: createSpyFromClass(ProductService) },
        provideAutoSpy(FavouriteService),
        provideAutoSpy(AuthService),
        provideAutoSpy(DialogService),
        provideAutoSpy(Router),
        { provide: ActivatedRoute, useClass: ActivatedRouteMock }
    ]
});

        // Spy for the services
        productServiceSpy = TestBed.inject<any>(ProductService);
        favouriteServiceSpy = TestBed.inject<any>(FavouriteService);
        authServiceSpy = TestBed.inject<any>(AuthService);
        dialogServiceSpy = TestBed.inject<any>(DialogService);
        routerServiceSpy = TestBed.inject<any>(Router);
        activatedRouteServiceMock = TestBed.inject<any>(ActivatedRoute);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductDetailComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        fakeProduct = {
            name: 'Trek SSL 2015',
            price: 999.9,
            description: 'Racing bike.',
            discontinued: false,
            fixedPrice: false,
            imageUrl: '',
            modifiedDate: new Date(2021, 3, 2)
        }
    });

    it('Is Authenticated should be true', () => {
        authServiceSpy.isLoggedIn.and.returnValue(true);
        expect(component.isAuthenticated()).toBeTrue();
        expect(authServiceSpy.isLoggedIn).toHaveBeenCalled();
    });

    it('Is Authenticated should be false', () => {
        authServiceSpy.isLoggedIn.and.returnValue(false);
        expect(component.isAuthenticated()).toBeFalse();
        expect(authServiceSpy.isLoggedIn).toHaveBeenCalled();
    });

    it('should get product with id route param', () => {
        activatedRouteServiceMock.snapshot.params['id'] = 1;

        productServiceSpy.getProductById.and.nextOneTimeWith(fakeProduct);

        component.ngOnInit();

        expect(component.product$).toBeDefined();
        let actualProduct;
        component.product$.subscribe((prod) => actualProduct = prod);
        expect(actualProduct).toBe(fakeProduct);
        expect(productServiceSpy.getProductById).toHaveBeenCalled();
    });

    it('should not get product with no id route param', () => {
        component.ngOnInit();
        expect(component.product$).toBeUndefined();
        expect(productServiceSpy.getProductById).not.toHaveBeenCalled();
    });

    // Async test: we have the dialogService confirm function returning a promise
    it('should delete product if user confirm', fakeAsync(() => { // We wrap the test spec function in a function called fakeAsync.
        routerServiceSpy.navigateByUrl.and.resolveTo(true);
        dialogServiceSpy.confirm.and.resolveTo(true);
        const productId = 1;
        productServiceSpy.deleteProduct.and.nextWith(null);
        component.deleteProduct(productId);
        tick(); // there are pending asynchronous activities we want to complete.
        expect(dialogServiceSpy.confirm).toHaveBeenCalled();
        expect(productServiceSpy.deleteProduct).toHaveBeenCalledWith(productId);
        expect(routerServiceSpy.navigateByUrl).toHaveBeenCalledWith("/products");
    }));

    it('should not delete product if user does not confirm', () => {
        dialogServiceSpy.confirm.and.resolveTo(false);
        const productId = 1;
        component.deleteProduct(productId);
        expect(dialogServiceSpy.confirm).toHaveBeenCalled();
        expect(productServiceSpy.deleteProduct).not.toHaveBeenCalled();
    });

    it('should add product to favourites', () => {
        favouriteServiceSpy.addToFavourites.and.returnValue(null);
        component.addToFavourites(fakeProduct);
        expect(favouriteServiceSpy.addToFavourites).toHaveBeenCalledWith(fakeProduct);
    });

    it('adding product to favourites emits favouriteAdded event', () => {
        favouriteServiceSpy.addToFavourites.and.returnValue(null);

        let actualProduct;
        component.favouriteAdded.subscribe(product => actualProduct = product);

        component.addToFavourites(fakeProduct);

        expect(actualProduct).toEqual(fakeProduct)
    });
});