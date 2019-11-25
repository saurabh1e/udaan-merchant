import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, filter, switchMap, tap} from 'rxjs/operators';
import {merge, Observable, Subject} from 'rxjs';
import {DataService} from '../../../@core/utils/data.service';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';


@Component({
	selector: 'ngx-type-ahead',
	templateUrl: './type-ahead.component.html',
	styleUrls: ['./type-ahead.component.scss'],
})
export class TypeAheadComponent implements OnInit {

	searching: boolean;
	searchFailed: boolean = true;

	@Input() model: any;
	@Input() disabled: any;
	@Input() filters: any;
	@Input() required = true;
	@Input() placeholder: string = 'Search here';
	@Input() url: string;
	@Input() value: string;
	@Input() notifySearchFail: boolean = false;
	@Input() displayNames: string[] = null;
	@Output() send: EventEmitter<any> = new EventEmitter();
	@Output() failed: EventEmitter<boolean> = new EventEmitter();

	@ViewChild('instance', {static: true}) instance: NgbTypeahead;
	focus$ = new Subject<string>();
	click$ = new Subject<string>();
	results: any[] = [];
	text: string = null;

	constructor(private http: DataService) {
	}

	ngOnInit() {
	}

	async searchApi(event) {
		try {
			const query = {};
			if (parseInt(event, 10)) {
				query['__phone__contains'] = event;
			} else {
				query['__name__contains'] = event;
			}

			for (const i in this.filters) {
				if (this.filters.hasOwnProperty(i)) {
					query[i] = this.filters[i];
				}
			}

			const res = await this.http.query(query, this.url);
			if (!res.hasOwnProperty('data')) {
				this.searchFailed = true;
				this.results = [];
				return [];
			} else {
				this.searchFailed = false;
				this.results = res.data;
				return res.data;
			}
		} catch (e) {
			this.searchFailed = true;
			this.results = [];
			return [];
		}
	}

	search = (text$: Observable<string>) => {
		const debouncedText$ = text$.pipe(
			debounceTime(300),
			distinctUntilChanged());

		const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
		const inputFocus$ = this.focus$;
		return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
			tap(() => this.searching = true),
			switchMap(async (term) => {
					try {
						const query = {};
						if (parseInt(term, 10)) {
							query['__phone__contains'] = term;
						} else {
							query['__name__contains'] = term;
						}

						for (const i in this.filters) {
							if (this.filters.hasOwnProperty(i)) {
								query[i] = this.filters[i];
							}
						}

						const res = await this.http.query(query, this.url);
						if (!res.hasOwnProperty('data')) {
							this.searchFailed = true;
							return [];
						} else {
							this.searchFailed = false;
							return res.data;
						}
					} catch (e) {
						this.searchFailed = true;
						return [];
					}
				},
			),
			tap(() => this.searching = false),
		);
	};


	emitSelected(event) {
		if (typeof event === typeof 'str') {
			return;
		}
		this.text = event.name;
		this.send.emit(event);
		this.searchFailed = true;
	}

	// @ts-ignore
	formatter = (x: { name: string }) => {
		if (!x.name) {
			return;
		}
		if (this.displayNames && this.displayNames.length) {
			return this.displayNames.map(d => x[d]).join(',');
		}
		return x.name;
	};

	resultFormatter = (x: { name: string, phone: string }) => {
		if (!x || !x.name) {
			return;
		}
		if (this.displayNames && this.displayNames.length) {
			return this.displayNames.map(d => x[d]).join(', ');
		}
		if (x.phone) {
			return x.name + ' - ' + x.phone;
		}
		return x.name;
	}

}
