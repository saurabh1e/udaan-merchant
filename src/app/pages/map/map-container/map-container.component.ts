import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import 'leaflet.awesome-markers';
import 'leaflet-rotatedmarker';
import * as L from 'leaflet';
import {icon, LatLngBounds, LayerGroup, marker, Marker, Polyline} from 'leaflet';
import {NbDialogService} from '@nebular/theme';
import {DataService, ToastService} from '../../../@core/utils';
import 'leaflet-draw';
import 'leaflet.measurecontrol';
import 'leaflet-control-geocoder';
import 'leaflet.fullscreen';
import {Address} from '../../../@core/models';
import {ajax} from 'rxjs/ajax';
import {interval, Subscription} from 'rxjs';
import {DialogComponent} from '../../../@theme/components';

@Component({
	selector: 'ngx-map-container',
	templateUrl: './map-container.component.html',
	styleUrls: ['./map-container.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapContainerComponent implements OnInit {

	eta: number = 0;
	distance: number = 0;
	replayMarker: L.Marker;
	polyline: Polyline;
	startMarker: Marker;
	endMarker: Marker;
	replayLine: Polyline[] = [];
	display: string = null;
	outlets: string = null;
	toggleClass: string = null;
	toggleStyle: string = null;
	toggleInfoClass: string = null;
	device: any = null;
	showDeviceInfo: boolean = false;
	merchantSet: boolean = false;
	toggleVal: boolean = true;
	placeholder: string = 'search';
	map: L.Map;
	markerClusterData: L.Layer[] = [];
	markers: any = {};
	markerCluster = L.markerClusterGroup(
		{
			spiderfyOnMaxZoom: true,
			showCoverageOnHover: true,
			zoomToBoundsOnClick: true,
			animate: false,
			animateAddingMarkers: false,
		},
	);
	showPoints: any[] = [];
	poisData: boolean = false;
	toggleInfoVal: boolean = true;
	markerClusterOptions: L.MarkerClusterGroupOptions = {
		animate: true, animateAddingMarkers: true,
	};

	outletClusterData: L.Layer[] = [];
	outletMarkers: any = {};
	outletCluster = L.markerClusterGroup(
		{
			spiderfyOnMaxZoom: true,
			showCoverageOnHover: true,
			zoomToBoundsOnClick: true,
			animate: false,
			animateAddingMarkers: false,
		},
	);
	outletClusterOptions: L.MarkerClusterGroupOptions = {
		animate: true, animateAddingMarkers: true,
	};

	zones: any[] = [];
	geoFences: any[] = [];
	showSearch: boolean = false;
	devices: any[] = [];
	path: Subscription;
	options = {
		layers: [
			L.tileLayer('https://2.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/' +
				'png8?app_id=qtRvU24UXWVa1BR0WMFE&app_code=ZYPlQj6aSVTJ6UIHywyWvA&ppi=320', {
				maxZoom: 18,
				attribution: '',

			}),
		],
		// measureControl: true,
		fullscreenControl: true,
		zoomControl: true,
		zoom: 10,
		center: L.latLng(28.613090, 77.230520),
	};
	bound: LatLngBounds[];
	layerMainGroup: LayerGroup[];

	drawItems = new L.FeatureGroup();

	drawOptions = {
		position: 'bottomright',
		draw: {
			polyline: true,
			marker: false,
			circle: false,
			circlemarker: false,
		},
		edit: {
			featureGroup: this.drawItems,
		},
	};

	poiOptions = {
		position: 'bottomright',
		draw: {
			polygon: false,
			rectangle: false,
			circle: false,
			circlemarker: false,
			marker: {
				icon: icon({
					iconSize: [25, 41],
					iconAnchor: [13, 41],
					iconUrl: 'assets/images/marker-icon.png',
					// shadowUrl: 'assets/images/marker-shadow.png',
				}),
			},
			polyline: false,
		},
	};

	constructor(private nbDialogService: NbDialogService, private http: DataService,
				private toast: ToastService,
				private cd: ChangeDetectorRef, private dialogService: NbDialogService) {

	}

	ngOnInit() {
	}

	onMapReady(map: L.Map) {
		this.map = map;
		this.map.addLayer(this.markerCluster);
		this.map.addLayer(this.outletCluster);
		this.map.addLayer(this.drawItems);

		const self = this;

		this.map.on(L.Draw.Event.EDITED, (e: any) => {
			const layers = e.layers;
			layers.eachLayer(async function (layer) {
				const featureGroup = L.featureGroup();
				featureGroup.addLayer(layer);
				const data: any = featureGroup.toGeoJSON();
				try {
					await self.http.update(data.features[0].properties.fenceId, {area: data}, {}, 'zone');
				} catch (e) {
				}
			});

		});
	}

	async created(e, type: string) {

		const featureGroup = L.featureGroup();
		featureGroup.addLayer(e.layer);
		const data: any = featureGroup.toGeoJSON();

		this.dialogService.open(DialogComponent, {
			context: {
				title: 'Enter GeoFence Name',
				body: '',
				type: 'prompt',
			},
		}).onClose.subscribe(async res => {
			if (res) {
				try {
					await this.http.create({area: data, name: res, type: type}, {}, 'zone');
				} catch (e) {
					this.toast.showToast('Error Adding Geo fence', 'Error', true, e);
				}

			} else {
				this.map.removeLayer(e.layer);
			}
		});

	}

	setDisplay(value: string) {
		if (this.display === value) {
			this.display = null;
			return;
		} else {
			this.display = value;
		}
	}

	setOutlets(value: string) {
		if (this.outlets === value) {
			this.outlets = null;
			this.outletCluster.clearLayers();
			return;
		} else {
			this.outlets = value;
			this.getOutlets();
		}
	}

	async getOutlets() {
		const res = await this.http.query({}, 'outlet');

		const self = this;
		res.data.filter(d => d.address.latitude && d.address.longitude).forEach(function (obj) {
			self.outletMarkers[obj.id] = marker([obj.address.latitude, obj.address.longitude], {
				icon: icon({
					iconSize: [25, 25],
					iconAnchor: [20, 0],
					iconUrl: 'assets/images/merchant.png',
				}),
			}).bindTooltip(obj.name, {permanent: false, direction: 'top', className: 'tooltipStyle'}).openTooltip();
			self.outletCluster.addLayer(self.outletMarkers[obj.id]);

		});

		this.map.fitBounds(this.outletCluster.getBounds());

	}

	initialMarkers(devices: { data: any[], status: boolean, clear: boolean }) {

		if (devices.clear) {
			this.markerCluster.clearLayers();
			this.markers = [];
			this.cd.detectChanges();
			return;
		}

		const self = this;
		devices.data.filter(d => d.lat && d.lng).forEach(function (obj) {
			if (!self.markers.hasOwnProperty(obj.user_id)) {
				self.markers[obj.user_id] = marker([obj.lat, obj.lng], {
					// icon: redMarker,
					alt: obj.user_id,
					rotationAngle: Math.round(obj.course),
					icon: icon({
						iconSize: [18, 46],
						iconAnchor: [13, 46],
						iconUrl: obj.on_duty === '1' ? 'assets/images/onduty.png' : 'assets/images/offduty.png',
						// shadowUrl: 'assets/images/marker-shadow.png',
					}),
				}).bindTooltip(obj.name, {
					permanent: false,
					direction: 'bottom',
					className: 'tooltipStyle',
				}).openTooltip()
					.on('click', self.markerClick.bind(self));
				self.markers[obj.user_id].previousLatLngs = [];
				self.markerCluster.addLayer(self.markers[obj.user_id]);
			} else {
				self.markers[obj.user_id].previousLatLngs.push(self.markers[obj.user_id].getLatLng());
				self.markers[obj.user_id].setLatLng([obj.lat, obj.lng]);
			}
		});
		this.cd.detectChanges();
		if (devices.status) {
			this.map.fitBounds(this.markerCluster.getBounds());
		}
	}

	showTouchPoints(points: {
		points: {
			sequence: number, name: string, lat: number, lon: number, time_window: string,
			reach_time: string, exit_time: string, id: number
		}[];
	}) {
		this.showPoints = points.points;
		this.cd.detectChanges();
		const markers: Marker[] = points.points.map(d => {
			return marker([d.lat, d.lon], {
				icon: icon({
					iconSize: [25, 25],
					iconAnchor: [13, 0],
					iconUrl: 'assets/images/Asset1.png',
					// shadowUrl: 'assets/images/marker-shadow.png',
				}),
				zIndexOffset: -1000,
			}).bindPopup(document.getElementById(d.id.toString(10)), {closeButton: true, keepInView: true});
		});
		//.bindTooltip(d.sequence.toString() + ' - ' + d.name,
		// 				{permanent: false, direction: 'top', className: 'tooltipStyle'}).openTooltip()


		const itemsLevel_1: LayerGroup = new LayerGroup();
		this.layerMainGroup = [itemsLevel_1];
		markers.forEach(async (m) => {
			const mark = await m;
			mark.addTo(itemsLevel_1);
		});

		this.layerMainGroup = [itemsLevel_1];
		if (markers.length) {
			this.map.fitBounds(L.latLngBounds(markers.map(m => m.getLatLng())));
		}
	}

	updateDeviceList(event: { status: boolean, data: any[], update: boolean }) {

		event.data.forEach(device => {
			if (event.status) {

				if (this.markers.hasOwnProperty(device.user_id)) {
					this.markers[device.user_id].previousLatLngs.push(this.markers[device.user_id].getLatLng());
					this.markers[device.user_id].setLatLng([device.lat, device.lng]);
				} else {
					this.markers[device.user_id] = marker([device.lat, device.lng], {
						// icon: redMarker,
						alt: device.user_id,
						rotationAngle: Math.round(device.course),
						icon: icon({
							iconSize: [18, 46],
							iconAnchor: [13, 46],
							iconUrl: device.on_duty === '1' ? 'assets/images/onduty.png' : 'assets/images/offduty.png',
							// shadowUrl: 'assets/images/marker-shadow.png',
						}),
					}).bindTooltip(device.name, {
						permanent: false,
						direction: 'bottom',
						className: 'tooltipStyle',
					}).openTooltip().on('click', this.markerClick.bind(this));
					this.markers[device.user_id].previousLatLngs = [];
					this.markerCluster.addLayer(this.markers[device.user_id]);
				}
			} else {
				this.markerCluster.removeLayer(this.markers[device.user_id]);
				delete this.markers[device.user_id];
			}
		});


		this.cd.detectChanges();

		if (event.status && event.update) {
			if (event.data.length > 1) {
				this.map.fitBounds(this.markerCluster.getBounds());
			} else {
				this.map.setView(new L.LatLng(event.data[0].lat, event.data[0].lng), 18);
			}
		}
	}

	async getETA(start: string, end: string): Promise<any> {
		return new Promise(resolve => ajax.get('https://route.api.here.com/routing/7.2/calculateroute.json?app_id=qtRvU24UXWVa1BR0WMFE' +
			'&app_code=ZYPlQj6aSVTJ6UIHywyWvA&waypoint0=geo!' + start + '&waypoint1=geo!' + end +
			'&mode=fastest;car;traffic:enabled', {}).subscribe(res => resolve(res.response)));
	}

	async merchantNearByRiders(event: { points: any[], merchant: Address }) {

		try {
			const res = await this.getETA([event.points[0].point.lat, event.points[0].point.lon].join(','), [event.merchant.latitude,
				event.merchant.longitude].join(','));
			this.distance = res.response.route[0].summary.distance;
			this.eta = res.response.route[0].summary.travelTime;
		} catch (e) {

		}


		const itemsLevel_1: LayerGroup = new LayerGroup();
		const markers = await event.points.map(async (d) => {

			return marker([d.point.lat, d.point.lon], {
				icon: icon({
					iconSize: [18, 46],
					iconAnchor: [13, 46],
					iconUrl: 'assets/images/rider.png',
					// shadowUrl: 'assets/images/marker-shadow.png',
				}),
			});
		});

		markers.forEach(async (m) => {
			const mark = await m;
			mark.addTo(itemsLevel_1);
		});
		const _marker = marker([event.merchant.latitude, event.merchant.longitude], {
			icon: icon({
				iconSize: [56, 56],
				iconAnchor: [13, 63],
				iconUrl: 'assets/images/merchant.png',
			}),
		});
		_marker.addTo(itemsLevel_1);
		if (!this.merchantSet && event.merchant) {
			this.map.setView([event.merchant.latitude, event.merchant.longitude], 15);
			this.merchantSet = true;
		}

		this.layerMainGroup = [itemsLevel_1];
		this.cd.detectChanges();
	}

	async setDevice(device: any) {
		const self = this;
		this.toggleInfo(false);
		this.device = await this.http.get(device.user_id, {
			__include: ['user_device', 'current_order', 'current_tms', 'categories', 'branches'],
			__only: ['user_device', 'current_order', 'current_tms', 'categories', 'id', 'name', 'phone', 'branches'],
		}, 'user');
		this.device.curr_address = 'Loading...';
		this.showDeviceInfo = true;
		this.cd.detectChanges();
		this.getAdress(this.device.user_device.lat, this.device.user_device.lng).then(function (res) {
			self.device.curr_address = res['0'].display_name;
		});
	}

	async getAdress(lat, lng) {
		const arr = [];
		arr.push({id: 0, lat: lat, lng: lng});
		return new Promise(resolve =>
			ajax.post('https://bugs.roadcast.co.in:8089/reverse',
				arr, {'content-type': 'application/json'}).subscribe(res => resolve(res.response)));
	}

	updatePOI(event: { data: any, status: boolean, fitBound?: boolean }) {

		const myIcon = L.icon({
			iconSize: [25, 41],
			iconAnchor: [13, 41],
			iconUrl: 'assets/images/marker-icon.png',
			// shadowUrl: 'assets/images/marker-shadow.png',
		});

		const layer = L.geoJSON(event.data.area, {
			pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {icon: myIcon});
			},
		});

		// const layer = L.geoJSON(event.data.area);
		const index = this.zones.findIndex(z => z.id === event.data.id);
		if (index > -1) {
			if (event.status === false) {
				this.map.removeLayer(this.zones[index].layer);
				this.zones.splice(index, 1);
			}

		} else {
			if (event.status === true) {
				event.data['layer'] = layer;
				this.zones.push(event.data);
				this.map.addLayer(layer);
			}
		}
		if (event.hasOwnProperty('fitBound') && event.fitBound) {
			this.map.fitBounds(layer.getBounds());
		}
	}

	geoFenceUpdate(event: any) {

		// const layer = L.geoJSON(event.data.area);
		const index = this.geoFences.findIndex(z => z.id === event.data.id);
		if (index > -1) {
			if (event.status === false) {
				this.map.removeLayer(this.geoFences[index].layer);
				this.geoFences.splice(index, 1);
			}

		} else {
			if (event.status === true) {
				const self = this;
				const fenceId = event.data.id;
				const layer = L.geoJSON(event.data.area, {
					onEachFeature: function (feature, l) {
						const props = feature.properties = feature.properties || {}; // Initialize feature.properties
						props.fenceId = fenceId;
						self.drawItems.addLayer(l);
					},
				});

				event.data['layer'] = layer;
				this.geoFences.push(event.data);
				this.map.addLayer(layer);
				if (event.hasOwnProperty('fitBound') && event.fitBound) {
					const bounds = L.geoJSON(this.geoFences[0].area).getBounds();
					this.geoFences.forEach((g, i) => {
						if (i > 0) {
							bounds.extend(L.geoJSON(g.area).getBounds());
						}
					});
					this.map.fitBounds(bounds);
				}
			}
		}
	}

	editPOI(event) {
		const drawnItems = new L.FeatureGroup();
		drawnItems.addLayer(L.geoJSON(event.area));
		this.map.addLayer(drawnItems);
		const drawControls = new L.Control.Draw(
			{
				edit: {
					featureGroup: drawnItems,
					edit: {
						selectedPathOptions: {},
					},
				},
			},
		);
		this.map.addControl(drawControls);
	}

	search(event) {
		const _marker = marker([event.latitude, event.longitude], {
			icon: icon({
				iconSize: [18, 46],
				iconAnchor: [13, 46],
				iconUrl: 'assets/images/rider.png',
				// shadowUrl: 'assets/images/marker-shadow.png',
			}),
		});

		this.map.addLayer(_marker);
		this.map.setView([event.latitude, event.longitude], 14);
	}

	toggleList() {
		if (this.toggleVal) {
			this.toggleClass = 'toggleClass';
			this.toggleStyle = 'toggleStyle';
		} else {
			this.toggleClass = '';
			this.toggleStyle = '';
		}
		this.toggleVal = !this.toggleVal;
	}

	toggleInfo(status: boolean) {
		// if (this.toggleInfoVal) {
		//   this.toggleInfoClass = 'toggleInfoClass';
		// } else {
		//   this.toggleInfoClass = '';
		//
		// }
		// this.toggleInfoVal = !this.toggleInfoVal;
		this.showDeviceInfo = status;
		this.device = null;
		this.clearPath();
		this.showTouchPoints({points: []});
	}

	showPath(coords: any[]) {
		this.clearPath();
		this.polyline = L.polyline(coords, {color: 'red'}).addTo(this.map);
		if (coords.length) {
			this.map.fitBounds(this.polyline.getBounds());
			this.startMarker = L.marker(coords[0], {
				icon: icon({
					iconSize: [35, 35],
					iconAnchor: [13, 46],
					iconUrl: 'assets/images/Asset3.png',
					// shadowUrl: 'assets/images/marker-shadow.png',
				}),
			}).addTo(this.map);

			this.endMarker = L.marker(coords[coords.length - 1], {
				icon: icon({
					iconSize: [35, 35],
					iconAnchor: [13, 46],
					iconUrl: 'assets/images/Asset2.png',
					// shadowUrl: 'assets/images/marker-shadow.png',
				}),
			}).addTo(this.map);
		}

	}

	showReplay(data: any) {
		this.clearReplay();
		if (data.speed === 'stop') {
			return;
		}
		const speed = data.speed;
		const Data = data.data;
		let inter = 1;
		let intervalIndex = 0;
		const cordArr = [];
		this.replayMarker = marker(Data[0], {
			icon: icon({
				iconSize: [18, 46],
				iconAnchor: [13, 46],
				iconUrl: 'assets/images/marker-icon.png',
				// shadowUrl: 'assets/images/marker-shadow.png',
			}),
		});
		this.map.addLayer(this.replayMarker);

		switch (speed) {
			case 'slow': {
				inter = 100;
				break;
			}
			case 'normal': {
				inter = 25;
				break;
			}
		}


		this.path = interval(inter)
			.subscribe(() => {
				cordArr.push(Data[intervalIndex]);
				const line = L.polyline(cordArr, {color: 'blue'}).addTo(this.map);
				this.replayLine.push(line);
				const newLatLng = new L.LatLng(Data[intervalIndex][0], Data[intervalIndex][1]);
				this.replayMarker.setLatLng(newLatLng);
				intervalIndex++;
				if (intervalIndex >= Data.length) {
					intervalIndex = 0;
					this.clearReplay();
				}
			});

	}

	clearReplay() {
		try {
			this.replayLine.forEach(r => this.map.removeLayer(r));
			this.replayLine = [];
			this.map.removeLayer(this.replayMarker);
		} catch (e) {

		}

		try {
			this.path.unsubscribe();
		} catch (e) {
		}
		this.cd.detectChanges();
	}

	clearPath() {
		if (this.polyline) {
			this.map.removeLayer(this.polyline);
		}
		try {
			this.map.removeLayer(this.startMarker);
			this.map.removeLayer(this.endMarker);
		} catch (e) {

		}
		this.clearReplay();
	}

	markerClick(e) {
		this.setDevice({user_id: e.target.options.alt}).then();
	}
}

