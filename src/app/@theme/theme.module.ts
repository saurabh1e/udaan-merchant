import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
	NbActionsModule,
	NbButtonModule, NbCardModule,
	NbCheckboxModule,
	NbContextMenuModule,
	NbDatepickerModule,
	NbIconModule,
	NbInputModule,
	NbLayoutModule,
	NbListModule,
	NbMenuModule,
	NbSearchModule,
	NbSelectModule,
	NbSidebarModule,
	NbThemeModule,
	NbUserModule,
} from '@nebular/theme';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import {NbSecurityModule} from '@nebular/security';

import {
	FooterComponent,
	HeaderComponent,
	LayoutDirectionSwitcherComponent,
	SearchInputComponent,
	SwitcherComponent,
	DialogComponent,
} from './components';
import {CapitalizePipe, NumberWithCommasPipe, PluralPipe, RoundPipe, TimingPipe,} from './pipes';
import {OneColumnLayoutComponent, ThreeColumnsLayoutComponent, TwoColumnsLayoutComponent,} from './layouts';
import {DEFAULT_THEME} from './styles/theme.default';
import {COSMIC_THEME} from './styles/theme.cosmic';
import {CORPORATE_THEME} from './styles/theme.corporate';
import {DARK_THEME} from './styles/theme.dark';
import {NgbDropdownModule, NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {DataTableComponent} from './components/data-table/data-table.component';
import {TypeAheadComponent} from './components/type-ahead/type-ahead.component';
import {FormsModule} from '@angular/forms';
import {FilterPipe} from "./pipes/pipes/filter.pipe";
import {UserListComponent} from "./components/user-list/user-list.component";
import {FileUploadComponent} from "./components/fileupload/file-upload.component";

const NB_MODULES = [
	NbLayoutModule,
	NbMenuModule,
	NbUserModule,
	NbActionsModule,
	NbSearchModule,
	NbSidebarModule,
	NbContextMenuModule,
	NbSecurityModule,
	NbButtonModule,
	NbSelectModule,
	NbIconModule,
	NbEvaIconsModule,
	NgbTabsetModule,
	NgbDropdownModule,
	NbDatepickerModule,
	NbCheckboxModule,
	NbListModule,
	NbInputModule,
];

const COMPONENTS = [
	SwitcherComponent,
	LayoutDirectionSwitcherComponent,
	HeaderComponent,
	FooterComponent,
	SearchInputComponent,
	OneColumnLayoutComponent,
	ThreeColumnsLayoutComponent,
	TwoColumnsLayoutComponent,
	DataTableComponent,
	TypeAheadComponent,
	UserListComponent,
	FileUploadComponent,
	DialogComponent,
];
const PIPES = [
	CapitalizePipe,
	PluralPipe,
	RoundPipe,
	TimingPipe,
	NumberWithCommasPipe,
	FilterPipe,
];

const ANGULAR_MODULES = [
	FormsModule,
];


@NgModule({
	imports: [CommonModule, ...NB_MODULES, ...ANGULAR_MODULES, NbCardModule],
	exports: [CommonModule, ...PIPES, ...COMPONENTS],
	declarations: [...COMPONENTS, ...PIPES],
	entryComponents: [DialogComponent],
})

export class ThemeModule {
	static forRoot(): ModuleWithProviders {
		return <ModuleWithProviders>{
			ngModule: ThemeModule,
			providers: [
				...NbThemeModule.forRoot(
					{
						name: 'corporate',
					},
					[DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME],
				).providers,
			],
		};
	}
}
