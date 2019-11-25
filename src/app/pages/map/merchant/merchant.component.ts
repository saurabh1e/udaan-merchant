import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {DataService} from '../../../@core/utils';
import {NbDialogService} from '@nebular/theme';
import {RequestDialogComponent} from './request-dialog/request-dialog.component';
import {UserService} from '../../../@core/utils/user.service';
import {interval, Subscription} from 'rxjs';
import {User} from '../../../@core/models/user';

@Component({
	selector: 'ngx-merchant',
	templateUrl: './merchant.component.html',
	styleUrls: ['./merchant.component.scss'],
})
export class MerchantComponent implements OnInit, OnDestroy {

	types: any[] = [];
	@Output()
	showRiders: EventEmitter<{ points: any[], merchant: any }> = new EventEmitter();
	user: User;
	nearbyRiderIds: number[] = [];
	sub: Subscription;
	sub2: Subscription;
	active: boolean = false;

	constructor(private http: DataService, private dialogService: NbDialogService,
				private userService: UserService) {
	}

	ngOnInit() {
		this.user = this.userService.user;
		if (this.user.id) {
			this.getVehicleType().then();
		}
		this.getRiders().then();
		this.sub2 = this.userService.user$.subscribe(res => {
			this.user = res;
			this.getVehicleType().then();
			this.getRiders().then();
		});

		this.sub = interval(15000)
			.subscribe(() => {
				this.getRiders().then();
			});
	}

	async getRiders() {
		if (this.user && this.user.address) {
			try {
				const mapData = await this.http.query({
						lat: this.user.address.latitude,
						lng: this.user.address.longitude
					},
					'nearby_riders');
				const index = mapData.fields.indexOf('user_id');
				this.nearbyRiderIds = mapData.points.map(p => p.fields[index]);
				this.showRiders.emit({points: mapData.points, merchant: this.user.address});
				this.active = true;
			} catch (e) {
				console.error(e);

			}

		}

	}

	async getVehicleType() {
		try {
			const types = await this.http.query({__id__in: this.user.categories.map(t => t.id).join(',')}, 'user_type');
			this.types = types.data;
		} catch (e) {
			console.error(e);
		}

	}

	openRequestDialog(type) {
		this.dialogService.open(RequestDialogComponent, {context: {type: type, userIds: this.nearbyRiderIds}});
	}

	ngOnDestroy(): void {
		try {
			this.sub2.unsubscribe();
			this.sub.unsubscribe();
		} catch (e) {
		}

	}
}
