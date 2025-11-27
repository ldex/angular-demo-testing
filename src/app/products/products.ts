import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    template: `
    <h2>Products</h2>
    <router-outlet></router-outlet>
  `,
    imports: [RouterOutlet]
})
export class Products { }