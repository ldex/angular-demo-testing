import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../product.interface';
import { Spy, provideAutoSpy, createSpyFromClass } from 'jasmine-auto-spies';
import { Router } from '@angular/router';
import { FavouriteService } from 'src/app/services/favourite.service';
import { ProductListComponent } from './product-list.component';
import { DebugElement, Pipe } from '@angular/core';
import { By } from '@angular/platform-browser';

export function mockPipe(options: Pipe): Pipe {
    const metadata: Pipe = {
      name: options.name
    };

    return <any>Pipe(metadata)(class MockPipe {});
}

describe('Product List Component', () => {
    let component: ProductListComponent;
    let fixture: ComponentFixture<ProductListComponent>;
    let productServiceSpy: Spy<ProductService>;
    let favouriteServiceSpy: Spy<FavouriteService>;
    let routerServiceSpy: Spy<Router>;
    let fakeProducts: Product[];
    let productElements: DebugElement[];

    beforeEach(() => {
        // refine the test module by declaring the test component
        TestBed.configureTestingModule({
    imports: [ProductListComponent,
        mockPipe({ name: 'orderBy' })],
    providers: [
        { provide: ProductService, useValue: createSpyFromClass(ProductService, { observablePropsToSpyOn: ['products$', 'productsTotalNumber$'] }) },
        provideAutoSpy(FavouriteService), // same as { provide: FavouriteService, useValue: createSpyFromClass(FavouriteService) },
        provideAutoSpy(Router)
    ]
});

        // Spy for the services
        productServiceSpy = TestBed.inject<any>(ProductService);
        favouriteServiceSpy = TestBed.inject<any>(FavouriteService);
        routerServiceSpy = TestBed.inject<any>(Router);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        productElements = fixture.debugElement.queryAll(By.css('.productItem'));
    });

    beforeEach(() => {
        fakeProducts = [
            {
                name: 'Trek SSL 2015',
                price: 999.9,
                description: 'Racing bike.',
                discontinued: false,
                fixedPrice: false,
                imageUrl: 'https://firebasestorage.googleapis.com/v0/b/angularstore-29f4b.appspot.com/o/products%2Ftrek.jpg?alt=media&token=42e1650e-7ff9-467f-bde7-0423786c94fd',
                modifiedDate: new Date(2016, 12, 8)
            },
            {
                name: 'City XT 2015',
                price: 659.5,
                description: 'City bike.',
                discontinued: true,
                fixedPrice: false,
                imageUrl: 'https://firebasestorage.googleapis.com/v0/b/angularstore-29f4b.appspot.com/o/products%2Fcity.jpg?alt=media&token=5a79c5c3-177f-44b3-b99e-fe6be97c4f7a',
                modifiedDate: new Date(2017, 1, 12)
            },
            {
                name: 'Cosmic Cobat 2015',
                price: 499.9,
                description: 'Great bike.',
                discontinued: false,
                fixedPrice: false,
                imageUrl: 'https://firebasestorage.googleapis.com/v0/b/angularstore-29f4b.appspot.com/o/products%2Fcosmic-cobat.jpg?alt=media&token=9df1af7a-9b79-4bf6-9b98-9079581fb7d1',
                modifiedDate: new Date(2017, 1, 2)
            },
            {
                name: 'Hero DTB 2016',
                price: 759,
                description: 'Champion\'s bike.',
                discontinued: false,
                fixedPrice: true,
                imageUrl: 'https://firebasestorage.googleapis.com/v0/b/angularstore-29f4b.appspot.com/o/products%2Fhero-dtb.jpg?alt=media&token=8cda2f52-2b86-43eb-aa86-2537346e8736',
                modifiedDate: new Date(2017, 1, 24)
            },
            {
                name: 'S-WORKS 2016',
                price: 1299.9,
                description: 'Ultra bike.',
                discontinued: false,
                fixedPrice: false,
                imageUrl: 'https://firebasestorage.googleapis.com/v0/b/angularstore-29f4b.appspot.com/o/products%2Fs-works.jpg?alt=media&token=5bf064a9-c8f7-4b47-a113-8825f95934f4',
                modifiedDate: new Date(2017, 1, 19)
            }
        ];
    });
    afterEach(() => {
        fixture.destroy();
    });

    it('should get products list', () => {
        productServiceSpy.products$.nextOneTimeWith(fakeProducts);
        component.ngOnInit();
        expect(component.products$).toBeDefined();
        let actualProducts;
        component.products$.subscribe((list) => actualProducts = list);
        expect(actualProducts).toEqual(fakeProducts);
    });

    it('should get products number', () => {
        productServiceSpy.products$.nextOneTimeWith(fakeProducts);
        component.ngOnInit();
        expect(component.productsNumber$).toBeDefined();
        let actualNumber;
        component.productsNumber$.subscribe((nb) => actualNumber = nb);
        expect(actualNumber).toEqual(fakeProducts.length);
    });

    it('should get products total number', () => {
        productServiceSpy.productsTotalNumber$.nextOneTimeWith(50);
        component.ngOnInit();
        expect(component.productsTotalNumber$).toBeDefined();
        let actualNumber;
        component.productsTotalNumber$.subscribe((nb) => actualNumber = nb);
        expect(actualNumber).toEqual(50);
    });

    it('should get favourites', () => {
        favouriteServiceSpy.getFavouritesNb.and.returnValue(25);
        expect(component.favourites).toEqual(25);
    });

    it('should init pagination', () => {
        expect(component.start).toBe(0);
        expect(component.end).toBe(5);
    });

    it('should get 5 products in template', () => {
        productServiceSpy.products$.nextOneTimeWith(fakeProducts);
        component.ngOnInit();
        expect(productElements.length).toEqual(0);
    });
});