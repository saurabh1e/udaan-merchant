import {Brand} from './brand';
import {Address, User} from './user';
import {Branch} from './branch';

export interface Outlet {

	id: number;
	name: string;
	brand: Brand;
	address: Address;
	users: User[];
	brand_id: number;
	branch: Branch;
	branch_id: number;
	prep_time: number;
	phone: number;
	trade_license_url: string;
	vat_url: string;
	email: string;
	categories: any[];
	vendor_type: string;
	vendor_type_upload: string;
	agreement_upload: string;
	establishment_certificate_upload: string;
	cancel_cheque_upload: string;
	pan_upload: string;
	gstin_upload: string;
	quotation_upload: string;
	registration_form_upload: string;
	account_holder_name: string;
	account_number: string;
	bank_name: string;
	ifsc_code: string;
}
