import {Outlet} from './outlet';
import {Zone} from './zone';
import {User} from './user';

export interface Branch {
	id: number;
	name: string;
	outlets: Outlet[];
	zone: Zone;
	zone_id: number;
	users: User[];

}
