import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GeofenceComponent} from './geofence/geofence.component';
import {MapContainerComponent} from './map-container/map-container.component';


const routes: Routes = [
	{
		path: '',
		component: MapContainerComponent,
		children: [
			{
				path: 'geofence',
				component: GeofenceComponent,
			},
		],
	},

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MapRoutingModule {
}
