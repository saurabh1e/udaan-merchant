import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';

@Component({
	selector: 'ngx-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
	@Input() title: string;
	@Input() body: string;
	@Input() type: string;

	constructor(protected ref: NbDialogRef<DialogComponent>) {
	}

	dismiss() {
		this.ref.close();
	}

	submit(name) {
		this.ref.close(name);
	}

	ngOnInit() {
	}

}

