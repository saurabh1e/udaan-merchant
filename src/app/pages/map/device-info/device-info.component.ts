import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataService} from '../../../@core/utils';
import * as moment from 'moment-timezone';

@Component({
	selector: 'ngx-device-info',
	templateUrl: './device-info.component.html',
	styleUrls: ['./device-info.component.scss'],
})
export class DeviceInfoComponent implements OnInit {

	@Input() device: any;
	startDate: Date = moment(moment().format('YYYY-MM-DD') + ' 00:00:01').tz('UTC').format('YYYY-MM-DDTHH:mm:ss');
	endDate: Date = moment(moment().format('YYYY-MM-DD') + ' 23:59:59').tz('UTC').format('YYYY-MM-DDTHH:mm:ss');
	address: string;
	coords: any[] = [];
	showTrack = true;
	showTouchPoint = true;
	replayStatus: boolean = false;
	playReplay: boolean = false;
	branches: string;
	@Output() sendPath: EventEmitter<any[]> = new EventEmitter();
	@Output() sendTouchPoints: EventEmitter<any> = new EventEmitter();
	@Output() replayPath: EventEmitter<any> = new EventEmitter();

	constructor(private http: DataService) {
	}

	ngOnInit() {
		// this.start.setDate(this.start.getDate());
		this.branches = this.device.branches.map(b => b.name).join(', ');
	}

	getDeviceList(): string {
		return this.device.categories.map(t => t.name).join(',');
	}

	async track() {
		let res;
		try {
			if (this.startDate && this.endDate) {
				res = await this.http.query({
						user_phone: this.device.phone,
						from: this.startDate,
						to: this.endDate,
					},
					'tracker_path');
			} else {
				res = await this.http.query({
						user_phone: this.device.phone,
						from: this.startDate,
						to: this.endDate,
					},
					'tracker_path');
			}
			const coords = res.data.filter(d => d.latitude && d.longitude).map(d => [d.latitude, d.longitude]);
			this.coords = coords;
			if (coords.length) {
				this.replayStatus = true;
			}
			this.sendPath.emit(coords);
		} catch (e) {
			this.sendPath.emit([]);
		}
	}

	replay(speed) {
		this.replayPath.emit({data: this.coords, speed: speed});
		this.playReplay = !this.playReplay;
	}


	changeRange(event) {
		if (event && event.start && event.end) {
			this.startDate = moment(moment(event.start.toJSON()).format('YYYY-MM-DD') + ' 00:00:01').tz('UTC')
				.format('YYYY-MM-DDTHH:mm:ss');
			this.endDate = moment(moment(event.end.toJSON()).format('YYYY-MM-DD') + ' 23:59:59').tz('UTC')
				.format('YYYY-MM-DDTHH:mm:ss');
		} else {
			this.startDate = moment(moment().format('YYYY-MM-DD') + ' 00:00:01').tz('UTC').format('YYYY-MM-DDTHH:mm:ss');
			this.endDate = moment(moment().format('YYYY-MM-DD') + ' 23:59:59').tz('UTC').format('YYYY-MM-DDTHH:mm:ss');
		}
	}

	async showTouchPoints() {
		this.sendTouchPoints.emit({
			points: this.device.current_tms.tms_points.map(t => {
				return {
					id: t.id,
					time_window: t.time_window,
					reach_time: t.reach_time,
					exit_time: t.exit_time,
					sequence: t.sequence,
					name: t.touch_point.name,
					lat: t.touch_point.latitude,
					lon: t.touch_point.longitude,
				};
			}),
		});
	}
}
