import {Outlet} from './outlet';

export interface Brand {
	id: number;
	name: string;
	outlets: Outlet[];
	email: string;
	phone: string;
}
