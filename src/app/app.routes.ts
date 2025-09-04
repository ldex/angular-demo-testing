import { Routes } from '@angular/router';
import { AdminComponent } from './common/admin.component';
import { ContactComponent } from './common/contact.component';
import { ErrorComponent } from './common/error.component';
import { HomeComponent } from './common/home.component';
import { LoginComponent } from './common/login.component';
import { LoginRouteGuard } from './services/login-route-guard.service';

export const routes: Routes = [
  { path: '', redirectTo:'/home', pathMatch:'full' },
  { path: 'home', component: HomeComponent },
  { path: 'products', loadChildren: () => import('./products/products.routes').then(m => m.productRoutes)},
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [LoginRouteGuard] },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo:'/error?reason=NavError' }
];