var dependencies = [
	// REMOTE DEPENDENCIES:
	'ngRoute',

	// LOCAL DEPENDENCIES:
	'appRoutes',

	// LOCAL DIRECTIVES:
	'infoChunk',

	// LOCAL CONTROLLERS:
	'MainCtrl', 'HomeCtrl', 'RPIAAboutCtrl', 'FAQCtrl', '5939AboutCtrl', 'OfficersCtrl',
	'CommunicationsCtrl', 'FR59AboutCtrl'
];

var app = angular.module('RPIA', dependencies);

app.config(['$sceProvider', function($sceProvider) {
	$sceProvider.enabled(false);
}]);