angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    var views = [
        'Home', 'RPIA-About', 'FAQ', '5939-About', 'FR59-About', 'Officers', 'Communications', 'Media', 'Minutes',
        'Mutual-Aid', 'Radio-Callsigns', 'Attendant-Training', 'Compatibility', 'Constitution', 'Contact', 'Copy',
        'Coverage', 'CPR-Certification', 'Crew-Chief-Training', 'Devs', 'DOH-Resources', 'Driver-Training',
        'EMT-Reciprocity', 'In-Service-Training', 'Login', 'Misc-Forms', 'New-Members-Training', 'RENSCO-Resources',
        'Report-Issue', 'SOP', 'Supervisor-Training', 'System-Requirements', 'Text-Message-Dispatch', 'Coverage-Details',
        'Join', 'Night-Crews', 'Member-List', 'Stocking-Issue', 'Fuel-Log', 'Add-Member', 'Expirations', 'Community',
        'Edit-Member', 'Games-Events', 'Add-Event', 'Edit-Default', 'Event', 'Game', 'Modify-Schedule', 'My-Training',
        'My-Settings', 'Announcements'
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

    $routeProvider.otherwise({
        redirectTo:'/home'
    });

    //$locationProvider.html5Mode(true);

}]);
