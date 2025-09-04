import { Routes } from '@angular/router';
import { LoginRouteGuard } from '../services/login-route-guard.service';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductInsertComponent } from './product-insert/product-insert.component';
import { ProductListComponent } from './product-list/product-list.component';


export const productRoutes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'insert', component: ProductInsertComponent, canActivate: [LoginRouteGuard] },
  { path: ':id', component: ProductDetailComponent }
];