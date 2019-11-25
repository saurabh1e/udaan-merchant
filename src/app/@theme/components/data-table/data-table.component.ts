import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from '../../../@core/utils';
import {NbDialogService} from '@nebular/theme';
import {saveAs} from 'file-saver';

export interface Column {
	name: string;
	sortable?: boolean;
	filter?: boolean;
	displayName: string;
	filterFn?: () => {};
	sortFn?: () => {};
	displayFn?: (row: any, column: any) => {};
}

@Component({
	selector: 'ngx-data-table',
	templateUrl: './data-table.component.html',
	styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit, AfterViewInit, OnChanges {
	@Input()
	columns: Column[] = [];
	@Input()
	dialogInputColumn: any[] = [];
	@Input()
	dialogCheckboxColumn: any[] = [];
	@Input()
	dialogDropdownColumn: any[] = [];
	@Input()
	filters: any[] = [];
	@Input()
	only: string[] = undefined;
	@Input()
	include: string[] = undefined;
	@Input()
	path: string;
	@Input()
	editPath: string;
	@Input()
	addNew = true;
	@Input()
	searchIcon = true;
	@Input()
	footer = true;
	@Input()
	inputQuery: any = {};
	@Input()
	infoIcon: boolean = false;
	@Input()
	editIcon: boolean;
	@Input()
	disableIcon: boolean;
	@Input()
	disableColumn: string = null;
	@Input()
	refresh: boolean = false;
	@Input()
	searchField: string = null;
	@Input()
	searchFields: any[] = [];
	@Input()
	searchTerm: string = undefined;

	page: number = 1;
	totalPages: any;
	currPage: number;
	limit = 10;
	data: any[] = [];
	query: any = {};
	editData: any = {};
	startDate: Date;
	endDate: Date;
	test = '';
	@Output() view: EventEmitter<any> = new EventEmitter<any>();
	@ViewChild('inputVal', {static: true})
	public formelement: ElementRef;

	constructor(private http: DataService, private router: Router, private nbDialogService: NbDialogService) {
		this.currPage = 1;
		this.totalPages = 1;
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.hasOwnProperty('inputQuery') || (changes.hasOwnProperty('refresh') &&
			changes.refresh.currentValue === true)) {
			this.loadData().then();
		}
	}

	ngOnInit() {
	}

	async nextPage() {
		this.currPage = (this.currPage < this.totalPages) ? (this.currPage + 1) : this.currPage;
		this.page = this.currPage;
		await this.loadData();
	}

	async previousPage() {
		this.currPage = (this.currPage > 1) ? (this.currPage - 1) : this.currPage;
		this.page = this.currPage;
		await this.loadData();
	}

	async setPage() {
		this.currPage = (this.currPage > this.totalPages) ? this.totalPages : ((this.currPage <= 0) ? 1 : this.currPage);
		this.page = this.currPage;
		await this.loadData();
	}

	ngAfterViewInit() {
		this.loadData().then();
	}

	async search() {
		this.page = 1;
		this.loadData().then();
	}

	async loadData() {
		try {
			const data = await this.getData();
			this.data = data.data;
			this.totalPages = Math.ceil(data.total / this.limit);
		} catch (e) {
			this.data = [];
		}
	}


	getData(): Promise<any> {
		this.query.__page = this.page;
		this.query.__only = this.only;
		this.query.__include = this.include;
		this.query.__limit = this.limit;

		if (this.searchField) {
			this.query[this.searchField] = this.searchTerm;
		}
		if (this.searchFields) {
			this.searchFields.forEach(s => {
				if (s.hasOwnProperty('term')) {
					this.query[s.value] = s.term;
				}
			});
		}

		this.query.__created_on__date_gte = this.startDate;

		this.query.__created_on__date_lte = this.endDate;

		for (const i in this.inputQuery) {
			if (this.inputQuery.hasOwnProperty(i)) {
				this.query[i] = this.inputQuery[i];
			}
		}
		return this.http.query(this.query, this.path);
	}

	applyFilter(filter: any, value: boolean) {
		if (value) {
			this.query[filter.value] = true;
		} else {
			this.query[filter.value] = undefined;
		}
		this.page = 1;
		this.loadData().then();
	}

	async download() {
		const query = Object.assign({}, this.query);
		query.__export__ = true;
		return await this.http.downloadFile(query, this.path);
	}

	async saveAs() {
		try {
			const data = await this.download();
			const blob = new Blob([data], {type: 'text/csv;charset=utf-8;'});
			saveAs(blob, new Date().toISOString().slice(0, 19).replace(/T/, '_') + '.csv');

		} catch (e) {
			return;
		}
	}

	edit(id?: number) {
		this.router.navigate([this.editPath + (id ? id.toString(10) : 'new')]).then();
	}

	async disable(row: any, column: string) {
		const obj = {};
		obj[column] = !row[column];
		await this.http.update(row.id, obj, {}, this.path);
		row[column] = !row[column];
	}

	changeRange(event) {
		if (event && event.start && event.end) {
			this.startDate = event.start.toJSON();
			this.endDate = event.end.toJSON();
		} else {
			this.startDate = undefined;
			this.endDate = undefined;
			this.formelement.nativeElement.value = '';
		}
		this.page = 1;
		this.loadData();
	}
}
