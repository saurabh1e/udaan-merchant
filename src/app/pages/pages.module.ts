import {NgModule} from '@angular/core';
import {NbMenuModule} from '@nebular/theme';

import {ThemeModule} from '../@theme/theme.module';
import {PagesComponent} from './pages.component';
import {DashboardModule} from './dashboard/dashboard.module';
import {PagesRoutingModule} from './pages-routing.module';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";

@NgModule({
	imports: [
		PagesRoutingModule,
		ThemeModule,
		NbMenuModule,
		DashboardModule,
		LeafletModule,
	],
	declarations: [
		PagesComponent,
	],
})
export class PagesModule {
}
