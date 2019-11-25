import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';

@Component({
	selector: 'ngx-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {

	@Input() url: string;
	@Input() type: string;
	@Input() required: boolean;
	@Output() getUrl: EventEmitter<string> = new EventEmitter();

	constructor(private storage: AngularFireStorage) {

	}

	ngOnInit() {
	}

	uploadFile(event) {
		const file: File = event.target.files[0];
		// const filePath = file.name;
		const filePath = this.uuidv4() + file.name.substr(file.name.lastIndexOf('.'));
		const ref = this.storage.ref(filePath);
		const task = ref.put(file);
		task.then(() => {
			this.url = 'https://firebasestorage.googleapis.com/v0/b/cabbie-17ac8.appspot.com/o/' + filePath + '?alt=media';
			this.getUrl.emit(this.url);
		});
	}

	uuidv4() {
		// @ts-ignore
		return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
			(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16),
		);
	}

}
