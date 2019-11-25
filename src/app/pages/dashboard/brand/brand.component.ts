import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'ngx-brand',
	templateUrl: './brand.component.html',
	styleUrls: ['./brand.component.scss'],
})
export class BrandComponent implements OnInit {
	columns =
		[{
			name: 'name',
			displayName: 'Name',
		},
			{
				name: 'total_outlets',
				displayName: 'Outlets.',
			},
		];

	constructor() {
	}

	ngOnInit() {
	}

}
