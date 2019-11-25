import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PagesComponent} from './pages.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {VehicleComponent} from "./dashboard/vehicle/vehicle.component";
import {BrandComponent} from "./dashboard/brand/brand.component";
import {BrandEditComponent} from "./dashboard/brand/brand-edit/brand-edit.component";
import {VehicleEditComponent} from "./dashboard/vehicle/vehicle-edit/vehicle-edit.component";

const routes: Routes = [{
	path: '',
	component: PagesComponent,
	children: [
		{
			path: 'dashboard',
			component: DashboardComponent, children: [
				{
					path: 'brand',
					component: BrandComponent,
				},
				{
					path: 'vehicle',
					component: VehicleComponent,
				},
				{
					path: 'brand/:id',
					component: BrandEditComponent,
				},
				{
					path: 'vehicle/:id',
					component: VehicleEditComponent,
				}
			],
		},
		{
			path: '',
			redirectTo: 'dashboard',
			pathMatch: 'full',
		},
		{
			path: 'map',
			loadChildren: () => import('app/pages/map/map.module')
				.then(m => m.MapModule),
		},
	],
}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PagesRoutingModule {
}
