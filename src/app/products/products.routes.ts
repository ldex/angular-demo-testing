import { Routes } from "@angular/router";
import { ProductDetails } from "./product-details/product-details";
import { ProductList } from "./product-list/product-list";
import { ProductForm } from "./product-form/product-form";
import { Products } from "./products";
import { productResolver } from "./product.resolver";

export const productsRoutes: Routes = [
    {
      path: '',
      component: Products,
      children: [
        { path: '', component: ProductList, title: 'Product List' },
        { path: 'create', component: ProductForm, title: 'Create Product' },
        { path: ':id', component: ProductDetails, resolve: { product: productResolver } },
      ]
    }
  ];