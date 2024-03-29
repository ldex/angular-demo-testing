import { ErrorComponent } from './common/error.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginRouteGuard } from './services/login-route-guard.service';

import { LoginComponent } from './common/login.component';
import { AdminComponent } from './common/admin.component';
import { ContactComponent } from './common/contact.component';
import { HomeComponent } from './common/home.component';

export const routes: Routes = [
  { path: '', redirectTo:'/home', pathMatch:'full' },
  { path: 'home', component: HomeComponent },
  { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)},
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [LoginRouteGuard] },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo:'/error?reason=NavError' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
