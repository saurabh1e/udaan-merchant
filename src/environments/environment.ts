/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false,

	url: "http://127.0.0.1:5000/api/v1/",
	firebaseConfig: {
		apiKey: 'AIzaSyDHQjLc4qDCUsHZJAN8X5_XXIyKDOggXHI',
		authDomain: 'cabbie-17ac8.firebaseapp.com',
		databaseURL: 'https://cabbie-17ac8.firebaseio.com',
		projectId: 'cabbie-17ac8',
		storageBucket: 'cabbie-17ac8.appspot.com',
		messagingSenderId: '1069362924003',
		appId: '1:1069362924003:web:6c0c90888cb96139',
	},
};
