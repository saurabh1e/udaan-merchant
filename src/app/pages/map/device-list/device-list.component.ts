import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	OnDestroy,
	OnInit,
	Output,
} from '@angular/core';
import {DataService} from '../../../@core/utils';
import {interval, Subscription} from 'rxjs';

@Component({
	selector: 'ngx-device-list',
	templateUrl: './device-list.component.html',
	styleUrls: ['./device-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceListComponent implements OnInit, OnDestroy {

	devices: any[] = [];
	deviceList: any[] = [];
	searchTerm: string = undefined;
	isInitial: boolean = true;
	sub: Subscription;
	currentDate: Date = new Date();

	@Output() initialEmit: EventEmitter<{ data: any[], status: boolean, clear: boolean }> = new EventEmitter();
	@Output() changeDevice: EventEmitter<{ status: boolean, data: any[], update: boolean }> = new EventEmitter();
	@Output() selectDevice: EventEmitter<any> = new EventEmitter();

	constructor(private http: DataService, private cd: ChangeDetectorRef) {
		this.sub = interval(15000)
			.subscribe(() => {

				this.getUpdates();

			});
	}

	ngOnInit() {
		this.loadNext().then(function () {
		});
	}

	async loadNext() {

		try {
			const devices = await this.http.query({
				__include: ['name', 'phone'], __order_by: ['-fixed_time'],
				__limit: 500,
			}, 'vendor_rider');
			if (devices.data && devices.data.length) {
				this.devices = devices.data;
				this.initialEmit.emit({data: devices.data, status: true, clear: false});

			} else {
				this.devices = [];
			}
		} catch (e) {

		}
	}

	checkDevice(device: any) {
		if (this.isInitial) {
			this.isInitial = false;
			this.initialEmit.emit({data: [], status: false, clear: true});
		}
		const index = this.deviceList.findIndex(d => d.id === device.id);
		if (index > -1) {
			this.deviceList.splice(index, 1);
			this.emit([device], false, true);
		} else {
			this.deviceList.push(device);
			this.emit([device], true, true);
		}
	}

	checkDeviceStatus(id: number): boolean {
		return this.deviceList.find(d => d.id === id);
	}

	emit(devices: any[], status: boolean, update: boolean) {

		this.changeDevice.emit({status: status, data: devices, update: update});

	}

	async getUpdates() {
		const currentTime: Date = new Date();
		this.currentDate.setSeconds(this.currentDate.getSeconds() - 5);
		try {
			const devices = await this.http.query({
				__order_by: ['-fixed_time'], __updated_on__datetime_gte: this.currentDate.toJSON(),
				__limit: 500,
			}, 'vendor_rider');
			this.currentDate = currentTime;
			if (devices && devices.hasOwnProperty('data')) {
				devices.data.forEach(d => {
					const device = this.devices.findIndex(dev => dev.id === d.id);
					if (device > -1) {
						this.devices[device].fixed_time = d.fixed_time;
						this.devices[device].battery_level = d.battery_level;
					}
				});
				if (this.deviceList.length) {
					devices.data.forEach(d => {
						const device = this.deviceList.findIndex(dev => dev.id === d.id);
						if (device > -1) {
							this.deviceList[device].fixed_time = d.fixed_time;
							this.deviceList[device].battery_level = d.battery_level;
							this.deviceList[device].lat = d.lat;
							this.deviceList[device].long = d.long;
						}
					});
					this.emit(this.deviceList, true, false);
				} else {
					if (this.isInitial) {
						this.initialEmit.emit({data: devices.data, status: false, clear: false});
					}

				}
			}
			this.cd.detectChanges();
		} catch (e) {
			console.error(e);
		}

	}

	unSelectAll() {
		this.emit(this.devices, false, true);
		this.deviceList = [];
	}

	selectAll() {
		this.deviceList = this.devices;
		this.emit(this.devices, true, true);
	}

	ngOnDestroy(): void {
		try {
			this.sub.unsubscribe();
		} catch (e) {

		}
	}
}
