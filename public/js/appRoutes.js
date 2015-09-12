angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    var views = [
        'Home', 'RPIA-About', 'FAQ', '5939-About', 'Officers'
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