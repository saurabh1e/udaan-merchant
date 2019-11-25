import {NgModule} from '@angular/core';
import {
	NbButtonModule,
	NbCalendarModule,
	NbCardModule, NbCheckboxModule, NbIconModule,
	NbInputModule, NbListModule, NbRadioModule,
	NbRouteTabsetModule,
	NbSelectModule, NbUserModule,
} from '@nebular/theme';

import {ThemeModule} from '../../@theme/theme.module';
import {DashboardComponent} from './dashboard.component';
import {BrandComponent} from "./brand/brand.component";
import {BrandEditComponent} from "./brand/brand-edit/brand-edit.component";
import {VehicleComponent} from "./vehicle/vehicle.component";
import {VehicleEditComponent} from "./vehicle/vehicle-edit/vehicle-edit.component";
import {FormsModule} from "@angular/forms";
import {AngularEditorModule} from "@kolkov/angular-editor";

@NgModule({
	imports: [
		ThemeModule,
		NbRouteTabsetModule,
		NbCardModule,
		NbButtonModule,
		FormsModule,
		NbInputModule,
		NbSelectModule,
		NbIconModule,
		NbCheckboxModule,
		NbCalendarModule,
		AngularEditorModule,
		NbRadioModule,
		NbUserModule,

		NbListModule
	],
	declarations: [
		DashboardComponent, BrandComponent, BrandEditComponent, VehicleComponent, VehicleEditComponent
	],
})
export class DashboardModule {
}
