import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductInsertComponent } from './product-insert/product-insert.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { LoginRouteGuard } from '../services/login-route-guard.service';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'insert', component: ProductInsertComponent, canActivate: [LoginRouteGuard] },
  { path: ':id', component: ProductDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule { }