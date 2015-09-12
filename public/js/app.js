var dependencies = [
	// REMOTE DEPENDENCIES:
	'ngRoute',

	// LOCAL DEPENDENCIES: 
	'appRoutes', // defined in appRoutes.js
	'MainCtrl', // defined in controllers/MainCtrl.js
	'HomeCtrl', // defined in controllers/MainCtrl.js
	'RPIAAboutCtrl' // defined in controllers/RPIAAboutCtrl.js
];

angular.module('RPIA', dependencies);