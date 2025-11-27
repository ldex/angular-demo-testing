import { Component } from '@angular/core';

@Component({
    selector: 'app-contact',
    template: `
        <h2>Contact Us</h2>
        <div style="margin-bottom: 80px">
            Our addresses:
            <ul>
                <li>123 Main St, Anytown, USA</li>
                <li>456 Maple Ave, Othertown, USA</li>
            </ul>
            Phone: (123) 456-7890<br/>
            Email: contact@web.com
        </div>
    `,
})
export class Contact {
    constructor() { }

}