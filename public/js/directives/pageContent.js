angular.module('pageContent', []).directive('pageContent', function() {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'js/directives/pageContent.html'
    };
});