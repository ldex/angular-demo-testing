import { Router } from '@angular/router';
import { ProductService } from './../../services/product.service';
import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
    selector: 'app-product-insert',
    templateUrl: './product-insert.component.html',
    styleUrls: ['./product-insert.component.css'],
    imports: [FormsModule, ReactiveFormsModule]
})
export class ProductInsertComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);


  insertForm: UntypedFormGroup;
  name: UntypedFormControl;
  price: UntypedFormControl;
  description: UntypedFormControl;
  imageUrl: UntypedFormControl;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    }

  onSubmit() {
    let newProduct = this.insertForm.value;
    console.log(newProduct);
    this.productService
      .insertProduct(newProduct)
      .subscribe(
        {
          next: (product) => {
            console.log('New Product Posted.');
            console.log(product);
            this.productService.clearList();
            this.router.navigateByUrl("/products");
          },
          error: (error) => console.log('Could not post product. ' + error),
          complete: () => console.log('New Product Post Complete.')
        }
      );
  }

  ngOnInit() {
    let validImgUrlRegex: string = '^(https?\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,5}(?:\/\S*)?(?:[-A-Za-z0-9+&@#/%?=~_|!:,.;])+\.(?:jpg|jpeg|gif|png))$';

    this.name = new UntypedFormControl('', [Validators.required, Validators.maxLength(50)]);
    this.price = new UntypedFormControl('', [Validators.required, Validators.min(0), Validators.max(10000000)]);
    this.description = new UntypedFormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]);
    this.imageUrl = new UntypedFormControl('', [Validators.pattern(validImgUrlRegex)]);

    this.insertForm = this.fb.group(
        {
            'name': this.name,
            'price': this.price,
            'description': this.description,
            'imageUrl': this.imageUrl,
            'discontinued': false,
            'fixedPrice': false
        }
    );
  }

}
