angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    var views = [
        'Home', 'RPIA-About'
    ];

    views.forEach(function (elem, index) {
        $routeProvider.when('/' + elem.toLowerCase(), {
            templateUrl: 'views/' + elem.toLowerCase() + '.html',
            controller: elem.replace('-', '') + 'Ctrl',
            caseInsensitiveMatch: true
        });
    });

    $routeProvider.otherwise({redirectTo:'/home'});

    //$locationProvider.html5Mode(true);

}]);