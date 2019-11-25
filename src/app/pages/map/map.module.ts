import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MapRoutingModule} from './map-routing.module';
import {MapContainerComponent} from './map-container/map-container.component';
import {GeofenceComponent} from './geofence/geofence.component';
import {ThemeModule} from '../../@theme/theme.module';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {LeafletDrawModule} from '@asymmetrik/ngx-leaflet-draw';
import {
	NbButtonModule,
	NbCardModule,
	NbCheckboxModule,
	NbDatepickerModule,
	NbDialogModule,
	NbIconModule,
	NbListModule,
	NbSelectModule,
	NbTooltipModule,
	NbUserModule,
	NbWindowModule,
	NbActionsModule,
} from '@nebular/theme';
import {PoiComponent} from './poi/poi.component';
import {DeviceListComponent} from './device-list/device-list.component';
import {MerchantComponent} from './merchant/merchant.component';
import {RequestDialogComponent} from './merchant/request-dialog/request-dialog.component';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {MomentModule} from 'angular2-moment';
import {LeafletMarkerClusterModule} from '@asymmetrik/ngx-leaflet-markercluster';
import {DeviceInfoComponent} from './device-info/device-info.component';
import {MssgDialogComponent} from './map-container/mssg-dialog/mssg-dialog.component';
import {FormsModule} from '@angular/forms';
import {NbSecurityModule} from '@nebular/security';

@NgModule({
	declarations: [MapContainerComponent, GeofenceComponent, PoiComponent, DeviceListComponent,
		MerchantComponent, RequestDialogComponent, DeviceInfoComponent, MssgDialogComponent],
	entryComponents: [RequestDialogComponent, MssgDialogComponent, DeviceInfoComponent],
	imports: [
		CommonModule,
		MapRoutingModule,
		ThemeModule,
		LeafletModule.forRoot(),
		LeafletDrawModule.forRoot(),
		NbWindowModule.forChild(),
		NbDialogModule.forChild(),
		OwlDateTimeModule,
		OwlNativeDateTimeModule,
		MomentModule,
		LeafletMarkerClusterModule,
		NbListModule,
		FormsModule,
		NbUserModule,
		NbCheckboxModule,
		NbTooltipModule,
		NbCardModule,
		NbSecurityModule,
		NbIconModule,
		NbDatepickerModule,
		NbSelectModule,
		NbButtonModule,
		NbActionsModule,
	],
	exports: [RequestDialogComponent],
})
export class MapModule {
}
