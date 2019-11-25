import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {DataService, ToastService, UserService} from '../../../../@core/utils';
import {MapsAPILoader} from '@agm/core';
import {NbDialogRef} from '@nebular/theme';

declare var google: any;

@Component({
	selector: 'ngx-request-dialog',
	templateUrl: './request-dialog.component.html',
	styleUrls: ['./request-dialog.component.scss'],
})
export class RequestDialogComponent implements OnInit {
	step: number = 1;
	type: any;

	addresses: any[] = [];
	address: any = {address: null, google_address: null};
	pick_up_address: any = {address: null, google_address: null};
	customer: any = {name: null, phone: null};
	orderData: any = {};
	start: Date;
	end: Date;
	startDate: Date = new Date();
	showMerchantForm: boolean = false;
	merchants: any[] = [];
	riders: any[] = [];
	types: any[] = [];
	riderTypes: any[] = [];
	userIds: number[] = [];
	user: any = {is_premium: false};

	@ViewChild('search', {static: true})
	public searchElementRef: ElementRef;

	@ViewChild('search1', {static: true})
	public search1ElementRef: ElementRef;

	@ViewChild('pickupSearch', {static: true})
	public pickupSearchElementRef: ElementRef;
	pincode: any;

	constructor(private http: DataService, private mapsAPILoader: MapsAPILoader, private userService: UserService,
				private ngZone: NgZone, private toast: ToastService, private ref: NbDialogRef<RequestDialogComponent>) {
		this.orderData = {
			payment_type: null,
			order_no: null,
			type_id: null,
			customer: {name: null, phone: null},
			is_express: null,
			is_cold: null,
			customer_id: null,
			delivery_address_id: undefined,
			pick_up_address_id: undefined,
		};
		this.user = this.userService.user;
		if (!this.orderData.id) {
			this.autoGenerateOrderNo();
		}
	}

	async getAvailability() {
		this.http.query({
			__user_type_id__equal: this.type.id, __only: ['id'],
			__id__in: [this.userIds],
		}, 'user').then(res => {
			if (!res) {
				// this.coolDialogs.alert('Riders not available!').subscribe(resul => {
				//   this.ref.close();
				// });
			}
		});
	}

	async ngOnInit() {
		if (this.type) {
			this.orderData.type_id = this.type.id;
			this.getAvailability().then();
		}

		if (this.orderData.customer_id) {
			this.getCustomerAddresses(this.orderData.customer_id);
			this.customer = this.orderData.customer;
		}
		if (this.orderData.pick_up_address) {
			this.pick_up_address = this.orderData.pick_up_address;
		}

		this.mapsAPILoader.load().then(() => {
			const self = this;
			const autoComplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
				componentRestrictions: {},
				types: [],
			});
			autoComplete.addListener('place_changed', () => {
				this.ngZone.run(() => {
					const place: any = autoComplete.getPlace();
					self.address.google_address = place.formatted_address;
					self.address.latitude = place.geometry.location.lat().toString();
					self.address.longitude = place.geometry.location.lng().toString();
					try {
						self.pincode = place.address_components.filter(a => a.types[0] === 'postal_code')[0].short_name;
					} catch (Exception) {
					}
				});
			});

			const autoCompletePickUp = new google.maps.places.Autocomplete(this.pickupSearchElementRef.nativeElement, {
				componentRestrictions: {},
				types: [],
			});
			autoCompletePickUp.addListener('place_changed', () => {
				this.ngZone.run(() => {
					const place: any = autoCompletePickUp.getPlace();
					self.pick_up_address.google_address = place.formatted_address;
					self.pick_up_address.latitude = place.geometry.location.lat().toString();
					self.pick_up_address.longitude = place.geometry.location.lng().toString();
				});
			});

			const shedule = new google.maps.places.Autocomplete(this.search1ElementRef.nativeElement, {
				componentRestrictions: {},
				types: [],
			});
			shedule.addListener('place_changed', () => {
				this.ngZone.run(() => {
					const place: any = autoCompletePickUp.getPlace();
					self.address.google_address = place.formatted_address;
					self.address.latitude = place.geometry.location.lat().toString();
					self.address.longitude = place.geometry.location.lng().toString();
				});
			});

		});
	}

	setAddress(event) {
		this.address.google_address = event.google_address;
		this.address.latitude = event.latitude;
		this.address.longitude = event.longitude;
	}

	setOrderType(isDuty: boolean) {
		this.step += 1;
		this.orderData.is_duty = isDuty;
	}

	goBack() {
		this.step -= 1;
	}

	autoGenerateOrderNo() {
		this.orderData.order_no = this.create_UUID();
	}

	async getMerchantInfo() {
		const res = await this.http.query({__is_merchant__bool: true}, 'user');
		this.merchants = res.data;
	}

	async setMerchantTypes(event) {
		const outlet = event;
		this.orderData.outlet_id = outlet.id;
		if (this.orderData.user_id) {
			return;
		}
		const branchId = outlet.branch_id;
		// this.getMerchantTypes(branchId).then();
		this.types = outlet.categories;
	}

	// async getMerchantTypes(branchId: number) {
	//   try {
	//     const res = await this.http.query({__branch_id__equal: branchId}, 'rate_list');
	//     if (res.hasOwnProperty('data')) {
	//       this.types = res.data.map(r => r.user_type);
	//     }
	//   } catch (e) {
	//     console.error(e);
	//   }
	// }

	// async getRiderInfo() {
	//   const res = await this.http.query({}, 'user');
	//   this.riders = res.data;
	// }

	async request() {
		let deliveryAddressId: number = null;
		let pickUpAddressId: number = null;
		let customerId: number = this.orderData.customer_id;
		try {
			if (!this.orderData.delivery_address_id && this.address.address) {
				const address = await this.http.create(this.address, {__only: 'id'}, 'address');
				deliveryAddressId = address[0].id;
				this.orderData.delivery_address_id = deliveryAddressId;
			}
			if (!this.orderData.pick_up_address_id && this.pick_up_address.address) {
				const address = await this.http.create(this.pick_up_address, {__only: 'id'}, 'address');
				pickUpAddressId = address[0].id;
				this.orderData.pick_up_address_id = pickUpAddressId;
			}
			if (!this.orderData.customer_id && this.customer.name) {
				const customer = await this.http.create(this.customer, {__only: 'id'}, 'customer');
				customerId = customer[0].id;
				this.orderData.customer_id = customerId;
			}
			if (customerId && deliveryAddressId) {
				await this.http.create({__action: 'add', customer_id: customerId, address_id: deliveryAddressId},
					{}, 'customer_address');
			}
			if (customerId && pickUpAddressId) {
				await this.http.create({__action: 'add', customer_id: customerId, address_id: pickUpAddressId},
					{}, 'customer_address');
			}
			if (this.orderData.id) {
				await this.http.update(this.orderData.id, this.orderData, {__only: 'id'}, 'order');
			} else {
				await this.http.create(this.orderData, {__only: 'id'}, 'order');
			}
			this.toast.showToast('Rider Requested Successfully', 'Success', false);
			this.ref.close();
		} catch (err) {
			this.toast.showToast('Error creating request', 'Error', true);
			console.error(err);
		}
	}

	async schedule() {
		this.orderData.order_no = this.create_UUID();
		this.orderData.duty_start_time = this.start.toJSON();
		this.orderData.duty_end_time = this.end.toJSON();

		// let deliveryAddressId: number = null;
		let pickUpAddressId: number = null;
		let customerId: number = this.orderData.customer_id;
		try {
			// if (!this.orderData.delivery_address_id && this.address.address) {
			// 	const address = await this.http.create(this.address, {__only: 'id'}, 'address');
			// 	deliveryAddressId = address[0].id;
			// 	this.orderData.delivery_address_id = deliveryAddressId;
			// }
			if (!this.orderData.pick_up_address_id && this.address.address) {
				const address = await this.http.create(this.pick_up_address, {__only: 'id'}, 'address');
				pickUpAddressId = address[0].id;
				this.orderData.pick_up_address_id = pickUpAddressId;
			}
			if (!this.orderData.customer_id && this.customer.name) {
				const customer = await this.http.create(this.customer, {__only: 'id'}, 'customer');
				customerId = customer[0].id;
				this.orderData.customer_id = customerId;
			}
			// if (customerId && deliveryAddressId) {
			// 	await this.http.create({__action: 'add', customer_id: customerId, address_id: deliveryAddressId},
			// 		{}, 'customer_address');
			// }
			if (customerId && pickUpAddressId) {
				await this.http.create({__action: 'add', customer_id: customerId, address_id: pickUpAddressId},
					{}, 'customer_address');
			}
			if (this.orderData.id) {
				await this.http.update(this.orderData.id, this.orderData, {__only: 'id'}, 'order');
			} else {
				await this.http.create(this.orderData, {__only: 'id'}, 'order');
			}
			this.toast.showToast('Rider Scheduled Successfully', 'Success', false);
			this.ref.close();
		} catch (err) {
			this.toast.showToast('Error creating request', 'Error', true);
			console.error(err);
		}
	}

	create_UUID() {
		let dt = new Date().getTime();
		return 'xxxyxyxxyxxx'.replace(/[xy]/g, c => {
			// tslint:disable-next-line:no-bitwise
			const r = (dt + Math.random() * 16) % 16 | 0;
			dt = Math.floor(dt / 16);
			// tslint:disable-next-line:no-bitwise
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
	}

	setTypes(event: any) {
		if (typeof event === typeof 'str') {
			return;
		}
		this.orderData.user_id = event.id;
		this.riderTypes = event.categories;
		// console.log(this.riderTypes);
	}

	setCustomer(event) {
		if (event) {
			this.orderData.customer_id = event.id;
			this.customer = event;
			this.getCustomerAddresses(event.id).then();
		} else {
			this.orderData.customer_id = undefined;
			this.orderData.delivery_address_id = undefined;
			this.orderData.customer = {name: null, phone: null};
		}

	}

	async getCustomerAddresses(id: number) {
		const res = await this.http.get(id, {__only: ['addresses'], __id__equal: id}, 'customer');
		this.addresses = res['addresses'];
	}

	cancel() {
		this.ref.close();
	}

	clearAddress() {
		if (this.orderData.delivery_address_id === 'undefined') {
			this.orderData.delivery_address_id = undefined;
		}

	}

	getFormValidity() {
		// if (!this.user.is_premium) {
		//   if (!this.orderData.customer_id && (!this.customer.name || !this.customer.phone)) {
		//     return true;
		//   } else {
		//     if (!this.orderData.delivery_address_id && (!this.address.address || this.address.google_address)) {
		//       return true;
		//     }
		//   }
		// }
		return false;
	}
}
