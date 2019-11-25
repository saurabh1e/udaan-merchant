import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GeofenceComponent} from './geofence.component';

describe('GeofenceComponent', () => {
	let component: GeofenceComponent;
	let fixture: ComponentFixture<GeofenceComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [GeofenceComponent],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GeofenceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
