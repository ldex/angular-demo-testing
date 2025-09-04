import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../product.interface';
import { ProductInsertComponent } from "./product-insert.component";
import { Spy, provideAutoSpy } from 'jasmine-auto-spies';
import { Router } from '@angular/router';

// Declare a mock for the Router service
class RouterMock {
    navigateByUrl() : void {}
}

describe('Product Insert Component (Reactive Form)', () => {
    let component: ProductInsertComponent;
    let fixture: ComponentFixture<ProductInsertComponent>;
    let productServiceSpy: Spy<ProductService>;

    beforeEach(() => {
        // refine the test module by declaring the test component
        TestBed.configureTestingModule({
    imports: [ReactiveFormsModule, FormsModule, ProductInsertComponent],
    providers: [
        provideAutoSpy(ProductService), // same as { provide: ProductService, useValue: createSpyFromClass(ProductService) },
        { provide: Router, useClass: RouterMock }
    ]
});

        // Spy for the Product Service
        productServiceSpy = TestBed.inject<any>(ProductService);

        // create component and test fixture
        fixture = TestBed.createComponent(ProductInsertComponent);

        // get test component from the fixture
        component = fixture.componentInstance;

        // manually trigger the ngOnInit lifecycle function
        component.ngOnInit();
    });

    it('name field validity', () => {
        let errors = {};
        let name = component.insertForm.controls['name'];
        expect(name.valid).toBeFalsy();

        // Name field is required
        errors = name.errors || {};
        expect(errors['required']).toBeTruthy();

        // Set name to something incorrect (too long)
        name.setValue("this product name is far too long so it should be invalid.");
        errors = name.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['maxlength']).toBeTruthy();

        // Set name to something correct
        name.setValue("this is fine");
        errors = name.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['maxlength']).toBeFalsy();
    });

    it('price field validity', () => {
        let errors = {};
        let price = component.insertForm.controls['price'];

        // Price field is required
        errors = price.errors || {};
        expect(errors['required']).toBeTruthy();

        // Set price to something invalid (negative)
        price.setValue("-10");
        errors = price.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['min']).toBeTruthy();
        expect(errors['max']).toBeFalsy();

        // Set price to something invalid (too expensive)
        price.setValue("123454546456456456");
        errors = price.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['min']).toBeFalsy();
        expect(errors['max']).toBeTruthy();

        // Set price to something correct
        price.setValue("789");
        errors = price.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['minlength']).toBeFalsy();
        expect(errors['max']).toBeFalsy();
    });

    it('form is invalid when empty', () => {
        expect(component.insertForm.valid).toBeFalsy();
    });

    it('form validity', () => {

        let newProduct: Product = {
            name: "product test",
            price: 999,
            description: "this is the product description.",
            discontinued: false,
            fixedPrice: false,
            imageUrl: '',
            modifiedDate: new Date(2021, 3, 3)
        }

        expect(component.insertForm.valid).toBeFalsy();
        component.insertForm.controls['name'].setValue(newProduct.name);
        component.insertForm.controls['price'].setValue(newProduct.price);
        component.insertForm.controls['description'].setValue(newProduct.description);
        expect(component.insertForm.valid).toBeTruthy();

        productServiceSpy.insertProduct.and.nextOneTimeWith(newProduct);

        // Trigger the submit function
        component.onSubmit();

        expect(productServiceSpy.insertProduct).toHaveBeenCalled();
    });
});