import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MssgDialogComponent} from './mssg-dialog.component';

describe('MssgDialogComponent', () => {
	let component: MssgDialogComponent;
	let fixture: ComponentFixture<MssgDialogComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MssgDialogComponent],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MssgDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
