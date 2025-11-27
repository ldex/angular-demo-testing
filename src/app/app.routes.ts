import { Routes } from '@angular/router';
import { Home } from './shared/home';
import { AppError } from './shared/app-error';
import { Admin } from './shared/admin';
import { Login } from './shared/login';
import { NavError } from './shared/nav-error';
import { loginRouteGuard } from './login-route.guard';
import { Contact } from './shared/contact';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home, title: 'Home' },
    { path: 'contact', component: Contact, title: 'Contact' },
    { path: 'admin', component: Admin, title: 'Admin', canActivate: [loginRouteGuard] },
    { path: 'login', component: Login, title: 'Login' },
    { path: 'products', loadChildren: () => import('./products/products.routes').then(m => m.productsRoutes) },
    { path: 'error', component: AppError, title: 'Error' },
    { path: '404', component: NavError, title: 'Not Found' },
    { path: '**', redirectTo:'404' },
];
