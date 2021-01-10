import { Router } from '@angular/router';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-product-insert',
  templateUrl: './product-insert.component.html',
  styleUrls: ['./product-insert.component.css']
})
export class ProductInsertComponent implements OnInit {

  insertForm: FormGroup;
  name: FormControl;
  price: FormControl;
  description: FormControl;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router) { }

  onSubmit() {
    let newProduct = this.insertForm.value;
    console.log(newProduct);
    this.productService
      .insertProduct(newProduct)
      .subscribe(
      product => {
        console.log('New Product Posted.');
        console.log(product);
        this.productService.clearList();
        this.router.navigateByUrl("/products");
      },
      error => console.log('Could not post product. ' + error),
      () => console.log('New Product Post Complete.')
      );
  }

  ngOnInit() {
    this.name = new FormControl('', [Validators.required]);
    this.price = new FormControl('', [Validators.required]);
    this.description = new FormControl('',
      [Validators.minLength(3),
      Validators.maxLength(50)]);
    this.insertForm = this.fb.group(
      {
        'name': this.name,
        'price': this.price,
        'description': this.description,
        'discontinued': false,
        'fixedPrice': false,
        'imageUrl': ''
      }
    );
  }

}
