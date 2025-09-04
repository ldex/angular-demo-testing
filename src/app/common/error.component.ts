import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';

@Component({
    templateUrl: './error.component.html',
    standalone: true
})
export class ErrorComponent implements OnInit {
    private route = inject(ActivatedRoute);

    message: string = "";

    ngOnInit() {
        this.message = this.route.snapshot.queryParams['reason'] || 'none';
    }
}