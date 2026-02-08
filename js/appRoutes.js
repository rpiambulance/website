angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    var views = [
        'Login', 'OIDC-Onboard', '404',
        'Night-Crews', 'Games-Events', 'Event', 'Game',
        'Member-List', 'Fuel-Log', 'Stocking-Issue', 'Grievance-Form',
        'Minutes', 'Misc-Forms', 'RENSCO-Resources', 'DOH-Resources',
        'Mutual-Aid', 'Radio-Callsigns', 'SOG',
        'My-Settings', 'My-Training',
        'Modify-Schedule', 'Edit-Default',
        'Add-Event', 'Add-Member', 'Edit-Member', 'Expirations'
    ];

    views.forEach(function (elem, index) {
        $routeProvider.when('/' + elem.toLowerCase(), {
            templateUrl: 'views/' + elem.toLowerCase() + '.html',
            controller: elem.replace(/-/g, '') + 'Ctrl',
            caseInsensitiveMatch: true,
            activeTab: elem.toLowerCase().replace(/ /g, '-'),
            title: elem.replace(/-/g, ' ')
        });
    });

    $routeProvider.when('/edit-member/:memberId', {
        templateUrl: 'views/edit-member.html',
        controller: 'EditMemberCtrl',
        caseInsensitiveMatch: true,
        activeTab: 'edit-member',
        title: 'Edit Member'
    });

    $routeProvider.when('/edit/:type/:eventId', {
        templateUrl: 'views/add-event.html',
        controller: 'AddEventCtrl',
        caseInsensitiveMatch: true,
        activeTab: 'add-event',
        title: 'Edit Event'
    });

    $routeProvider.when('/game/:gameId', {
        templateUrl: 'views/game.html',
        controller: 'GameCtrl',
        caseInsensitiveMatch: true,
        activeTab: 'games-events',
        title: 'View Game Details'
    });

    $routeProvider.when('/event/:eventId', {
        templateUrl: 'views/event.html',
        controller: 'EventCtrl',
        caseInsensitiveMatch: true,
        activeTab: 'games-events',
        title: 'View Event Details'
    });

    $routeProvider.when('/games-events', {
        templateUrl: 'views/games-events.html',
        controller: 'GamesEventsCtrl',
        caseInsensitiveMatch: true,
        // This is necesary as else anytime you update a search() parameter, it causes the full
        // page to reload which is ugly
        reloadOnSearch: false,
        activeTab: 'games-events',
        title: 'Games Events',
    });

    $routeProvider.when('/logout', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
    });

    // Redirect the legacy home route to the members login page
    $routeProvider.when('/home', {
        redirectTo: '/login'
    });

    // Default route now goes to login (members-only portal)
    $routeProvider.otherwise({
        redirectTo:'/login'
    });

    // $locationProvider.html5Mode(true);

}]);
