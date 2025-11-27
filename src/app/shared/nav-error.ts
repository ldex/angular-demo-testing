import { Component } from '@angular/core';

@Component({
    selector: 'app-nav-error',
    template: `
        <h2 class="errorMessage">Navigation Error!</h2>
        <p style="margin-bottom: 80px">
            The navigation to the requested page failed.
        </p>
    `,
})
export class NavError {


}