import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'ngx-vehicle',
	templateUrl: './vehicle.component.html',
	styleUrls: ['./vehicle.component.scss'],
})
export class VehicleComponent implements OnInit {

	columns = [
		{
			name: 'id',
			displayName: '#',
		},
		{
			name: 'registration_number',
			displayName: 'Registration Number',
		},
		{
			name: 'vendor',
			displayName: 'Vendor Name',
			displayFn: (r => r.vendor ? r.vendor.name : ''),
		},
		{
			name: 'type',
			displayName: 'Type',
		},
		{
			name: 'storage',
			displayName: 'Storage',
		},
	];

	constructor() {
	}

	ngOnInit() {
	}

}
