import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './error.component.html',
    standalone: true
})
export class ErrorComponent implements OnInit {

    message: string = "";

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.message = this.route.snapshot.queryParams['reason'] || 'none';
    }
}