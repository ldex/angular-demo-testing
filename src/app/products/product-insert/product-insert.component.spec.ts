import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ProductInsertComponent } from "./product-insert.component";

describe('Product Insert Component', () => {

    let component: ProductInsertComponent;
    let fixture: ComponentFixture<ProductInsertComponent>;

    beforeEach(() => {

        // refine the test module by declaring the test component
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, FormsModule],
            declarations: [ProductInsertComponent]
        });

        // create component and test fixture
        fixture = TestBed.createComponent(ProductInsertComponent);

        // get test component from the fixture
        component = fixture.componentInstance;
        component.ngOnInit();
    });

    it('form invalid when empty', () => {
        expect(component.insertForm.valid).toBeFalsy();
    });

    it('name field validity', () => {
        let errors = {};
        let name = component.insertForm.controls['name'];
        expect(name.valid).toBeFalsy();

        // Name field is required
        errors = name.errors || {};
        expect(errors['required']).toBeTruthy();

        // Set name to something incorrect
        name.setValue("foo");
        errors = name.errors || {};
        expect(errors['required']).toBeFalsy();

        // Set email to something correct
        name.setValue("test@example.com");
        errors = name.errors || {};
        expect(errors['required']).toBeFalsy();
    });

    it('price field validity', () => {
        let errors = {};
        let price = component.insertForm.controls['price'];

        // Price field is required
        errors = price.errors || {};
        expect(errors['required']).toBeTruthy();

        // Set email to something
        price.setValue("123454546456456456");
        errors = price.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['minlength']).toBeTruthy();

        // Set email to something correct
        price.setValue("123456789");
        errors = price.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['minlength']).toBeFalsy();
    });

    it('submitting a form emits a product', () => {
        expect(component.insertForm.valid).toBeFalsy();
        component.insertForm.controls['email'].setValue("test@test.com");
        component.insertForm.controls['password'].setValue("123456789");
        expect(component.insertForm.valid).toBeTruthy();

        // let user: User;
        // // Subscribe to the Observable and store the user in a local variable.
        // component.loggedIn.subscribe((value) => user = value);

        // // Trigger the login function
        // component.login();

        // Now we can check to make sure the emitted value is correct
        // expect(user.email).toBe("test@test.com");
        // expect(user.password).toBe("123456789");
    });
});