angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    var views = [
        'Home', 'Communications', 'Media', 'Minutes','Mutual-Aid', 'Radio-Callsigns', 'Attendant-Training', 
        'Compatibility', 'Constitution', 'Bylaws', 'Copy', 
        'Crew-Chief-Training', 'Devs', 'DOH-Resources', 'Driver-Training', 'EMT-Reciprocity', 'In-Service-Training', 
        'Login', 'Misc-Forms', 'RENSCO-Resources', 'SOG', 'Supervisor-Training', 
        'System-Requirements', 'Text-Message-Dispatch', 'Night-Crews', 'Member-List', 'Stocking-Issue', 'Fuel-Log', 
        'Add-Member', 'Expirations', 'Community', 'Edit-Member', 'Games-Events', 'Add-Event', 'Edit-Default', 
        'Event', 'Game', 'Modify-Schedule', 'My-Settings', 'Fuel-Log', '404', 'edit-event', 'Grievance-Form'
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
