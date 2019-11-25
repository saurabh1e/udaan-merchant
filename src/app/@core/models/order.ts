import {Outlet} from './outlet';
import {Address, User} from './user';

export interface Order {
	id: number;
	outlet: Outlet;
	user: User;
	order_status: OrderStatus[];
	total: number;
	delivery_address: Address;
	branch_name: string;
	created_on: Date;
	user_id: number;
	payment_type: string;
	is_duty: boolean;
	markers: any[];
	status_code: number;
}


export interface OrderStatus {
	order: Order;
	order_id: number;
	status_id: number;
	status: Status;
}

export interface Status {
	id: number;
	name: string;
	unique_id: number;
}
