var dependencies = [
	// REMOTE DEPENDENCIES:
	'ngRoute',

	// LOCAL DEPENDENCIES: 
	'appRoutes', // defined in appRoutes.js
	'MainCtrl', // defined in controllers/MainCtrl.js
	'NerdCtrl', // defined in controllers/NerdCtrl.js
	'NerdService' // defined in services/NerdService.js
];

angular.module('RPIA', dependencies);