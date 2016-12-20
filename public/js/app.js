var dependencies = [
    // REMOTE DEPENDENCIES:
    'ngRoute', 'ngCookies', 'ng-showdown',

    // LOCAL DEPENDENCIES:
    'appRoutes',

    // LOCAL DIRECTIVES AND SERVICES:
    'infoChunk', 'pageContent', 'editContent', 'modal',
    'EditablePageService', 'AuthService',

    // LOCAL CONTROLLERS:
    'MainCtrl', 'HomeCtrl', 'RPIAAboutCtrl', 'FAQCtrl', '5939AboutCtrl', 'OfficersCtrl', 'CommunicationsCtrl',
    'FR59AboutCtrl', 'MediaCtrl', 'MinutesCtrl', 'MutualAidCtrl', 'RadioCallsignsCtrl', 'AttendantTrainingCtrl',
    'CompatibilityCtrl', 'ConstitutionCtrl', 'ContactCtrl', 'CopyCtrl', 'CoverageCtrl', 'CPRCertificationCtrl',
    'CrewChiefTrainingCtrl', 'DevsCtrl', 'DOHResourcesCtrl', 'DriverTrainingCtrl', 'EMTReciprocityCtrl',
    'InServiceTrainingCtrl', 'LoginCtrl', 'MiscFormsCtrl', 'NewMembersTrainingCtrl', 'RENSCOResourcesCtrl',
    'ReportIssueCtrl', 'SOPCtrl', 'SupervisorTrainingCtrl', 'SystemRequirementsCtrl', 'TextMessageDispatchCtrl',
    'CoverageDetailsCtrl', 'JoinCtrl', 'NightCrewsCtrl', 'MemberListCtrl', 'FuelLogCtrl', 'StockingIssueCtrl',
    'AddMemberCtrl', 'ExpirationsCtrl', 'CommunityCtrl', 'EditMemberCtrl', 'GamesEventsCtrl', 'AddEventCtrl', 'EditDefaultCtrl',
    'EventCtrl', 'GameCtrl', 'GamesEventsCtrl', 'ModifyScheduleCtrl', 'MySettingsCtrl', 'MyTrainingCtrl', 'AnnouncementsCtrl',
    'NominationsCtrl', 'FuelLogEntriesCtrl', 'mwl.calendar', 'ui.bootstrap', 'moment'
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

app.run(['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {
	var AUTHED_PAGES = [
		'night-crews', 'member-list', 'fuel-log', 'stocking-issue', 'expirations', 'announcements',
		'attendant-training', 'driver-training', 'crew-chief-training', 'supervisor-training', 'in-service-training',
		'communications', 'emt-reciprocity', 'minutes', 'misc-forms', 'mutual-aid', 'misc-forms', 'radio-callsigns',
		'rensco-resources', 'sop', 'doh-resources', 'text-message-dispatch', 'my-settings', 'my-training', 'logout'
	];

	var SCHEDULING_PAGES = [
		'modify-schedule', 'edit-default'
	];

	var ADMIN_PAGES = [
		'add-event', 'add-member', 'edit-member'
	];

    $rootScope.$on('$routeChangeStart', function (event, next, other) {
        var nextPageUrl = next.$$route.originalPath.split('/').pop();

        if(ADMIN_PAGES.indexOf(nextPageUrl) !== -1) {
            AuthService.isAdmin().then(function (data) {
                if(data.admin != 1) {
                    console.log('Admin page attempted by non-admin');
                    event.preventDefault();
                    $location.path('/login');
                }
            });
        } else if(SCHEDULING_PAGES.indexOf(nextPageUrl) !== -1) {
            AuthService.isAdmin().then(function (data) {
                if(data.schedco != 1 && data.admin != 1) {
                    console.log('Scheduling Coordinator page attempted by non-coordinator');
                    event.preventDefault();
                    $location.path('/login');
                }
            });
        } else if(AUTHED_PAGES.indexOf(nextPageUrl) !== -1) {
            AuthService.isLoggedIn().then(function (isLoggedIn) {
                if(!isLoggedIn) {
                    console.log('Authed page attemped by signed-out user');
                    event.preventDefault();
                    $location.path('/login');
                } else if(nextPageUrl === 'logout') {
                    event.preventDefault();
                    AuthService.logout();
                }
            });
        } else if(nextPageUrl === 'login') {
            AuthService.isLoggedIn().then(function (isLoggedIn) {
                if(isLoggedIn) {
                    $location.path('/night-crews');
                }
            });
        }
    });
}]);
