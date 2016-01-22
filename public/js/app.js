var dependencies = [
	// REMOTE DEPENDENCIES:
	'ngRoute', 'ng-showdown',

	// LOCAL DEPENDENCIES:
	'appRoutes',

	// LOCAL DIRECTIVES AND SERVICES:
	'infoChunk', 'pageContent', 'editContent', 'modal',
	'EditablePageService',

	// LOCAL CONTROLLERS:
	'MainCtrl', 'HomeCtrl', 'RPIAAboutCtrl', 'FAQCtrl', '5939AboutCtrl', 'OfficersCtrl', 'CommunicationsCtrl',
	'FR59AboutCtrl', 'MediaCtrl', 'MinutesCtrl', 'MutualAidCtrl', 'RadioCallsignsCtrl', 'AttendantTrainingCtrl',
	'CompatibilityCtrl', 'ConstitutionCtrl', 'ContactCtrl', 'CopyCtrl', 'CoverageCtrl', 'CPRCertificationCtrl',
	'CrewChiefTrainingCtrl', 'DevsCtrl', 'DOHResourcesCtrl', 'DriverTrainingCtrl', 'EMTReciprocityCtrl',
	'InServiceTrainingCtrl', 'LoginCtrl', 'MiscFormsCtrl', 'NewMembersTrainingCtrl', 'RENSCOResourcesCtrl',
	'ReportIssueCtrl', 'SOPCtrl', 'SupervisorTrainingCtrl', 'SystemRequirementsCtrl', 'TextMessageDispatchCtrl',
	'CoverageDetailsCtrl', 'JoinCtrl', 'FuelLogCtrl'
];

var app = angular.module('RPIA', dependencies);

app.config(['$sceProvider', function($sceProvider) {
	$sceProvider.enabled(false);
}]);

app.config(['$showdownProvider', function($showdownProvider) {
	$showdownProvider.setOption('headerLevelStart', 3);
	$showdownProvider.setOption('noHeaderId', true);
	$showdownProvider.setOption('parseImgDimensions', true);
}]);
