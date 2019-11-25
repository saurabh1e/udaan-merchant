import {Component, OnInit} from '@angular/core';
import {Brand} from '../../../../@core/models';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService, ToastService} from '../../../../@core/utils';
import {Location} from '@angular/common';

@Component({
	selector: 'ngx-brand-edit',
	templateUrl: './brand-edit.component.html',
	styleUrls: ['./brand-edit.component.scss'],
})
export class BrandEditComponent implements OnInit {


	id: number = null;
	brand: Brand = <Brand>{outlets: []};

	constructor(private activateRoute: ActivatedRoute, private http: DataService, private toaster: ToastService,
				private _location: Location, private router: Router) {
		this.activateRoute.params.subscribe(res => {
			if (res['id'] !== 'new') {
				this.id = parseInt(res['id'], 10);
				this.getBrand().then();
			}
		});
	}

	ngOnInit() {
	}

	async getBrand() {
		try {
			this.brand = await this.http.get(this.id, {__include: ['outlets']}, 'brand');
		} catch (e) {

		}
	}

	async save() {
		try {
			if (this.id) {
				await this.http.update(this.id, this.brand, {}, 'brand');
			} else {
				const res = await this.http.create(this.brand, {__only: 'id'}, 'brand');
				this.id = res[0].id;
				this.brand.id = res[0].id;
				await this.router.navigate(['/pages/management/base/brand/' + this.id.toString(10)]);
			}
			this.toaster.showToast('Saved brand successful', 'Success', false);
		} catch (e) {
			this.toaster.showToast('Error saving brand ' + e.toString(), 'Success', true);
		}
	}

	async cancel() {
		this._location.back();
	}

}
