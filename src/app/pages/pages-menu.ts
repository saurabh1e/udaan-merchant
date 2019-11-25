import {NbMenuItem} from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
	{
		title: 'Dashboard',
		icon: 'home-outline',
		link: '/pages/dashboard',
		home: true,
	},
	{
		title: 'MANAGE',
		group: true,
	},
	{
		title: 'MAP',
		icon: 'lock-outline',
		link: '/pages/map',
	},
];
