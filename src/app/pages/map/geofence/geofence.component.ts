import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import {DataService} from '../../../@core/utils';
import {DialogComponent} from '../../../@theme/components';
import {NbDialogService} from '@nebular/theme';

// import {NgxCoolDialogsService} from 'ngx-cool-dialogs';

@Component({
	selector: 'ngx-geo-fence',
	templateUrl: './geofence.component.html',
	styleUrls: ['./geofence.component.scss'],
})
export class GeofenceComponent implements OnInit, OnChanges {
	@Output() focusOut: EventEmitter<number> = new EventEmitter<number>();
	editMode = false;

	page: number = 1;
	zones: any[] = [];
	loading: boolean = false;
	@Output()
	emitGeoFence: EventEmitter<any> = new EventEmitter();

	@Input()
	data: any;

	constructor(private http: DataService, private cd: ChangeDetectorRef, private dialogService: NbDialogService) {
	}

	ngOnInit() {
		this.loadNext().then();
	}

	async loadNext() {
		if (this.loading) {
			return;
		}
		try {
			this.loading = true;
			const zones = await this.http.query({__page: this.page, __type__equal: 'geo_fence'}, 'zone');
			if (zones.data && zones.data.length) {
				this.loading = false;
				this.zones = zones.data;
				this.page += 1;
			}
		} catch (e) {

		}
	}

	async ngOnChanges(changes: SimpleChanges) {
		const zones = await this.http.query({__page: 1, __type__equal: 'geo_fence'}, 'zone');
		if (zones && zones.data && zones.data.length) {
			this.loading = false;
			this.zones = zones.data;
			this.cd.detectChanges();
		}
	}

	addAll() {
		this.zones.forEach((p, index) => this.emitGeoFence.emit({
			data: p, status: true,
			fitBound: index + 1 === this.zones.length,
		}));
	}

	clearAll() {
		this.zones.forEach(p => this.emitGeoFence.emit({data: p, status: false}));
	}

	async deleteZone(id: number, index: number) {

		this.dialogService.open(DialogComponent, {
			context: {
				title: 'Do you want to remove the geofence?',
				body: '',
				type: 'confirm',
			},
		}).onClose.subscribe(async res => {
			if (res) {
				await this.http.delete(id, {}, 'zone');
				this.zones.splice(index, 1);
			} else {

			}
		});
	}

	async saveZone(id: number, data: any) {
		await this.http.update(id, data, {}, 'zone');
	}

	// async editZone(one) {
	//   console.log('one',one)
	//   console.log('one',one.value)
	//   one.value = "Testung";
	// }
	// onFocusOut() {
	//   this.focusOut.emit(this.data);
	// }
}
