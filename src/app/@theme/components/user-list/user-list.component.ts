import {Component, Input, OnInit} from '@angular/core';
import {DataService, ToastService} from '../../../@core/utils';
import {Router} from '@angular/router';

@Component({
	selector: 'ngx-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {

	@Input()
	serial: string = '1';
	@Input()
	users: any[] = [];
	@Input()
	branchId: number;
	@Input()
	vehicleId: number;
	@Input()
	isAdmin: boolean;
	filters: any = {__only: ['id', 'name', 'phone']};

	constructor(private http: DataService, private toaster: ToastService, private router: Router) {
	}

	ngOnInit() {
		if (this.vehicleId) {
			this.filters['__is_rider__bool'] = true;
		} else {
			this.filters['__is_admin__bool'] = true;
			this.filters['__active__bool'] = true;
			this.getUser();
		}
	}

	async getUser() {
		try {
			const query = {
				__only: ['id', 'name', 'phone'], __branch_id__equal: this.branchId,
				userFilter: true, __limit: 100
			};
			query[this.isAdmin ? '__is_admin__bool' : '__is_rider__bool'] = true;
			const users = await this.http.query(query, 'user');
			if (users.data && users.data.length) {
				this.users = users.data;
			} else {
				this.users = [];
			}
		} catch (e) {
		}
	}

	async addUser(event) {
		if (!this.vehicleId) {
			try {
				await this.http.create({
					__action: 'add',
					user_id: event.id,
					branch_id: this.branchId,
				}, {}, 'user_branch_association');
				this.users.push(event);
				this.toaster.showToast('Successfully added user.', 'Success', false);
			} catch (e) {
				this.toaster.showToast('Error adding user ', 'Error', true, e);
			}
		} else {
			try {
				await this.http.update(event.id, {vehicle_detail_id: this.vehicleId}, {}, 'user');
				this.users.push(event);
				this.toaster.showToast('Successfully added user.', 'Success', false);
			} catch (e) {
				this.toaster.showToast('Error adding user ', 'Error', true, e);
			}
		}

	}

	async removeUser(id: number, index: number) {
		if (!this.vehicleId) {
			try {
				await this.http.create({
					__action: 'remove',
					user_id: id,
					branch_id: this.branchId,
				}, {}, 'user_branch_association');
				this.users.splice(index, 1);
				this.toaster.showToast('Successfully removed user.', 'Success', false);
			} catch (e) {
				this.toaster.showToast('Error removing user ', 'Error', true, e);
			}
		} else {
			try {
				await this.http.update(id, {vehicle_detail_id: null}, {}, 'user');
				this.users.splice(index, 1);
				this.toaster.showToast('Successfully removed user.', 'Success', false);
			} catch (e) {
				this.toaster.showToast('Error removing user ', 'Error', true, e);
			}
		}

	}

	editUser(id?: number) {
		if (!this.vehicleId && this.isAdmin) {
			this.router.navigate(['/pages/management/base/user/' + (id ? id.toString(10) : 'new')]);
		} else {
			this.router.navigate(['/pages/management/base/rider/' + (id ? id.toString(10) : 'new')]);
		}
	}
}
