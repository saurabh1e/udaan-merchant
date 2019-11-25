import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';

@Component({
	selector: 'ngx-mssg-dialog',
	templateUrl: './mssg-dialog.component.html',
	styleUrls: ['./mssg-dialog.component.scss'],
})
export class MssgDialogComponent implements OnInit {
	title: String;

	constructor(protected ref: NbDialogRef<MssgDialogComponent>, private http: DataService) {
		this.title = 'GEOFENCE';
	}

	ngOnInit() {
	}

	cancel() {
		this.ref.close();
	}

	async mssg() {
		await this.http.create({}, {}, 'zone');
	}

}
