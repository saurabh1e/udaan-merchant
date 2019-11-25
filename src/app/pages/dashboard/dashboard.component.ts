import {Component} from '@angular/core';

@Component({
	selector: 'ngx-dashboard',
	templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
	tabs: any[] = [
		{
			title: 'Vendor Brands',
			route: './brand',
		},

		{
			title: 'Vehicle',
			route: './vehicle',
		},

	];
}
