import {Status} from './order';
import {Brand} from './brand';

export interface User {
	id: number;
	name: string;
	parent_id: string;
	parent: any;
	branches: any[];
	password: string;
	address: Address;
	role: Role;
	phone: string;
	email: string;
	field1: string;
	outlets: any[];
	categories: Category[];
	statuses: Status[];
	user_type_id: number;
	is_premium: boolean;
	role_id: number;
	brand_id: number;
	brand: Brand;
	company_id: string;
	vehicle_detail?: VehicleDetail;
	on_boarding_detail?: OnBoardingDetail;
	rider_on_boarding_detail?: RiderOnBoardingDetail;
}

export interface Address {
	id: number;
	address: string;
	google_address: string;
	latitude: number;
	longitude: number;
}


export interface Role {
	id: number;
	name: string;
	external_identity: string;
	level: number;
}

export interface Category {
	id: number;
	name: string;
	type: string;
	icon: string;
}


export interface VehicleDetail {
	id: number;
	registration_type: string;
	registration_number: string;
	registration_from: string;
	registration_to: string;
	registration_upload: string;
	insurance_from: string;
	insurance_to: string;
	insurance_upload: string;
	pollution_upload: string;
	pollution_expiry: string;
	fitness_upload: string;
	fitness_expiry: string;
	manufacturer: string;
	model: string;
	manufacturing_year: number;
	type: string;
	storage: string;
	users: User[];
	vendor: User;
	vendor_id: number;
	clusters: Cluster[];
	on_boarding_detail?: OnBoardingDetail;
}

export interface OnBoardingDetail {
	id: number;
	vehicle_detail_id: number;
	agreement_upload: string;
	owner_photo_upload: string;
	noc_upload: string;
	account_holder_name: string;
	bank_name: string;
	account_number: string;
	ifsc_code: string;
	bank_document_upload: string;
	pan_card_upload: string;
	tds_upload: string;
	is_completed: boolean;
	is_owner: string;
	is_loader: string;
	owner_name: string;
	owner_phone: string;
	owner_father_name: string;
	owner_age: string;
	owner_address: string;
	pan_number: string;
}

export interface RiderOnBoardingDetail {
	id: number;
	rider_id: number;
	driver_license_upload: string;
	driver_address_upload: string;
	driver_image_upload: string;
	is_completed: boolean;
}

export interface RateList {
	id: number;
	name: string;
	description: string;
	currency: string;
	rates: Rate[];
	categories: Category[];
}

export interface Rate {
	id?: number;
	name: string;
	value: number;
	rate_list_id: number;
}

export interface Cluster {
	id: number;
	name: string;
}
