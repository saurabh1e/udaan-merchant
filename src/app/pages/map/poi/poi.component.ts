import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DataService} from '../../../@core/utils';

@Component({
	selector: 'ngx-poi',
	templateUrl: './poi.component.html',
	styleUrls: ['./poi.component.scss'],
})
export class PoiComponent implements OnInit, OnChanges {
	page: number = 1;
	pois: any[] = [];
	@Output()
	emitPoiFence: EventEmitter<any> = new EventEmitter();

	@Output()
	emitEditPOI: EventEmitter<any> = new EventEmitter();

	@Input()
	data: any;


	constructor(private http: DataService) {
	}

	ngOnInit() {
		this.loadNext().then();
	}

	ngOnChanges(changes: SimpleChanges) {
		this.loadNext().then();
	}

	async loadNext() {

		try {

			const pois = await this.http.query({__page: this.page, __type__equal: 'poi', __limit: 500}, 'zone');
			this.pois = pois.data;

		} catch (e) {

		}
	}

	addAll() {
		this.pois.forEach((p, index) => this.emitPoiFence.emit({
			data: p,
			status: true,
			fitBound: index + 1 === this.pois.length,
		}));
	}

	clearAll() {
		this.pois.forEach(p => this.emitPoiFence.emit({data: p, status: false}));
	}

	async deletePOI(id: number, index: number) {
		// this.coolDialogs.confirm('Do you want to remove this poi')
		//   .subscribe(async res => {
		//     if (res) {
		//       try {
		//         await this.http.delete(id, {}, 'zone');
		//         this.pois.splice(index, 1);
		//       } catch (e) {
		//       }
		//     } else {
		//     }
		//   });
	}

}
