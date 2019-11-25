import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {User, VehicleDetail} from '../../../../@core/models';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService, ToastService, UserService} from '../../../../@core/utils';
import {Location} from '@angular/common';
import * as moment from 'moment';
import {OnBoardingDetail} from '../../../../@core/models/user';
import {DialogComponent} from '../../../../@theme/components';
import {NbDialogService} from '@nebular/theme';

@Component({
	selector: 'ngx-vehicle-edit',
	templateUrl: './vehicle-edit.component.html',
	styleUrls: ['./vehicle-edit.component.scss'],
})
export class VehicleEditComponent implements OnInit {

	certificate_expiry: any = moment().format('DD/MM/YYYY');
	isDateClicked = false;
	id: number = null;
	date = new Date();
	user: User = <User>{categories: []};
	vehicle: VehicleDetail = <VehicleDetail>{};
	currDate: string = moment().format('DD-MM-YYYY');
	day: string = moment().format('DD');
	month: string = moment().format('MM');
	year: string = moment().format('YY');
	// riderOnBoardingDetail: RiderOnBoardingDetail = <RiderOnBoardingDetail>{};
	onBoardingDetail: OnBoardingDetail = <OnBoardingDetail>{};
	@ViewChild('tdsDoc', {static: true})
	public tdsDocRef: ElementRef;

	@ViewChild('driverAgreement', {static: true})
	public driverAgreement: ElementRef;
	public meUser: User;

	constructor(private activateRoute: ActivatedRoute, private http: DataService, private toaster: ToastService,
				private _location: Location, private router: Router, public userService: UserService,
				private dialogService: NbDialogService) {
		this.activateRoute.params.subscribe(res => {
			if (res['id'] !== 'new') {
				this.id = parseInt(res['id'], 10);
				this.getVehicleDetail().then();
			}
		});
		this.meUser = userService.user;
		this.userService.user$.subscribe(user => {
			this.meUser = user;
		});
	}

	ngOnInit() {
	}

	async getVehicleDetail() {
		try {
			this.vehicle = await this.http.get(this.id,
				{__include: ['users', 'on_boarding_detail', 'rider_on_boarding_detail', 'vendor']}, 'vehicle_detail');
			if (this.vehicle.on_boarding_detail) {
				this.onBoardingDetail = this.vehicle.on_boarding_detail;
			}
		} catch (e) {

		}
	}

	async save() {
		// console.log('this.vehicle', this.vehicle);
		try {
			if (this.id) {
				await this.http.update(this.id, this.vehicle, {}, 'vehicle_detail');
			} else {
				const res = await this.http.create(this.vehicle, {__only: 'id'}, 'vehicle_detail');
				this.id = res[0].id;
				this.vehicle.id = res[0].id;
				await this.router.navigate(['/pages/management/base/vehicle-detail/' + this.id.toString(10)]);
			}
			this.toaster.showToast('Saved vehicle successful', 'Success', false);
		} catch (e) {
			this.toaster.showToast('Error saving vehicle ' + e.toString(), 'Success', true);
		}
	}

	async cancel() {
		this._location.back();
	}

	datePicker() {
		this.isDateClicked = !this.isDateClicked;
	}

	handleDateChange(data, column) {
		this.date = data;
		this.isDateClicked = false;
		if (column === 'registration_from') {
			this.vehicle.registration_from = moment(data).format('DD/MM/YYYY');
		} else if (column === 'registration_to') {
			this.vehicle.registration_to = moment(data).format('DD/MM/YYYY');
		} else {
			this.certificate_expiry = moment(data).format('DD/MM/YYYY');
		}

	}

	async generateTds() {
		if (this.onBoardingDetail.owner_name
			&& this.onBoardingDetail.owner_address && this.onBoardingDetail.pan_number) {
			const wnd = window.open('about:blank', '', '_blank');
			wnd.document.write(
				`<html>
          <head>
          <style type='text/css'>
              td {
              font-size: 11px;
              font-weight: bold;
              }
          </style>
          </head>
          <body >`
				+ this.tdsDocRef.nativeElement.innerHTML + `</body>
      </html>`,
			);
			wnd.print();
			return wnd.close();
		} else {
			this.dialogService.open(DialogComponent, {
				context: {
					title: 'Missing required fields.',
					body: 'Please provide all the fields.',
					type: 'alert',
				},
			}).onClose.subscribe(async res => {
			});

		}
	}

	async generateAgreement() {
		// @ts-ignore
		// console.log('driverAgreement', this.Anexture.textArea.nativeElement.innerHTML);
		if (this.onBoardingDetail.owner_name
			&& this.onBoardingDetail.owner_address && this.onBoardingDetail.pan_number) {
			const wnd = window.open('about:blank', '', '_blank');
			wnd.document.write(
				`<html>
              <head>
              <style type='text/css'>
                 @media print {
  .annexure {page-break-before: always;}
  .priceTablebreak{page-break-before: always;}
  .priceBreak{page-break-before: always;}
  .Absenteeism{page-break-before: always}
  .TonnerSample{page-break-before: always}
  .lessThan{page-break-before: always}
  .page-break-before{page-break-before: always}

  .header, .header-space
 {
  height: 70px;
}
.header {
  position: fixed;
  top: 0;
}
.footer {
  position: fixed;
  bottom: 0;
}
p{
    margin: 4px;
    padding: 0%;
    line-height: 3ch;
}
}
/* .table1 {
  border-collapse: collapse;
} */

.table1, .table1 th, .table1 td {
  border: 1px solid black;
}
              </style>
              </head>
              <body >`
				+ this.driverAgreement.nativeElement.innerHTML + `</body>
          </html>`,
			);
			wnd.print();
			return wnd.close();
		} else {
			this.dialogService.open(DialogComponent, {
				context: {
					title: 'Missing required fields.',
					body: 'Please provide all the fields.',
					type: 'alert',
				},
			}).onClose.subscribe(async res => {
			});
		}

	}

	// async saveRiderOn() {
	//     if (this.vehicle.id) {
	//         this.riderOnBoardingDetail.vehicle_detail_id = this.vehicle.id;
	//     }
	//     try {
	//         if (this.riderOnBoardingDetail.id) {
	//             await this.http.update(this.user.rider_on_boarding_detail.id,
	//             this.riderOnBoardingDetail, {}, 'rider_on_boarding_detail');
	//         } else {
	//             const res = await this.http.create(this.riderOnBoardingDetail, {__only: 'id'},
	//             'rider_on_boarding_detail');
	//             this.riderOnBoardingDetail.id = res[0].id;
	//             // this.user.id = res[0].id;
	//         }
	//         this.toaster.showToast('Saved rider on boarding successful', 'Success', false);
	//     } catch (e) {
	//         this.toaster.showToast('Error saving rider on boarding', 'Error', true, e);
	//     }
	// }

	async saveOnBoarding() {
		if (this.vehicle.id) {
			this.onBoardingDetail.vehicle_detail_id = this.vehicle.id;
		}
		try {
			if (this.onBoardingDetail.id) {
				await this.http.update(this.onBoardingDetail.id, this.onBoardingDetail, {}, 'on_boarding_detail');
			} else {
				const res = await this.http.create(this.onBoardingDetail, {__only: 'id'}, 'on_boarding_detail');
				this.onBoardingDetail.id = res[0].id;
				// this.user.id = res[0].id;
			}
			this.toaster.showToast('Saved on boarding successful', 'Success', false);
		} catch (e) {
			this.toaster.showToast('Error saving on boarding', 'Error', true, e);
		}
	}

	async getUser() {
		try {
			this.user = await this.http.get(this.id, {
				__include: ['branches', 'user_device', 'categories',
					'vehicle_detail', 'rider_on_boarding_detail', 'on_boarding_detail'],
			}, 'user');
		} catch (e) {

		}
	}

	completeBoarding() {
		this.dialogService.open(DialogComponent, {
			context: {
				title: 'Are you sure ?',
				body: 'You wont be able to change the information after this.',
				type: 'confirm',
			},
		}).onClose.subscribe(async res => {
			if (res) {
				// submit method
				await this.http.update(this.onBoardingDetail.id, {is_completed: true}, {}, 'on_boarding_detail');
			} else {
			}
		});
	}

	async addCluster(event) {

		try {
			await this.http.create({
				__action: 'add',
				cluster_id: event.id,
				vehicle_detail_id: this.vehicle.id,
			}, {}, 'vehicle_cluster_associations');
			this.vehicle.clusters.push(event);
			this.toaster.showToast('Successfully added cluster.', 'Success', false);
		} catch (e) {
			this.toaster.showToast('Error adding user ', 'Error', true, e);
		}

	}

	async removeCluster(id: number, index: number) {

		try {
			await this.http.create({
				__action: 'remove',
				cluster_id: id,
				vehicle_detail_id: this.vehicle.id,
			}, {}, 'vehicle_cluster_associations');
			this.vehicle.clusters.splice(index, 1);
			this.toaster.showToast('Successfully removed cluster.', 'Success', false);
		} catch (e) {
			this.toaster.showToast('Error removing user ', 'Error', true, e);
		}


	}

	checkRequired(columnName: string) {
		switch (this.vehicle.registration_type) {
			case 'ADHOC': {
				return ['registration_number', 'registration_upload', 'pan_card_upload', 'bank_document_upload',
					'vendor_id'].indexOf(columnName) > -1;
			}
			case 'EXPRESS': {
				return true;
			}
			case 'VENDOR': {
				return ['registration_number', 'registration_upload', 'pan_card_upload', 'bank_document_upload',
					'vendor_id', 'rc_expiry', 'rc_from', 'registration_upload'].indexOf(columnName) > -1;
			}
			default: {
				return true;
			}
		}
	}

	getFields(name: string): string {
		switch (name) {
			case 'ADHOC': {
				return ['registration_number', 'registration image', 'pan_card image', 'bank_document image',
					'vendor_id'].map(r => r.replace('_', ' ').toUpperCase()).join('<br>');
			}
			case 'EXPRESS': {
				return 'All fields are required';
			}
			case 'VENDOR': {
				return ['registration_number', 'registration image', 'pan_card image', 'bank_document image',
					'vendor_id', 'rc_expiry', 'rc_from', 'registration image'].map(r => r.replace('_', ' ').toUpperCase()).join('<br>');
			}
			default: {
				return 'All fields are required';
			}
		}
	}

	showRequiredFieldPopUp(name: string) {
		this.dialogService.open(DialogComponent, {
			context: {
				title: 'Required Fields',
				body: this.getFields(name),
				type: 'alert',
			},
		});
	}
}
