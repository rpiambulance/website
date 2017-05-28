angular.module('pageContent', []).directive('pageContent', ['$showdown', function($showdown) {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'js/directives/pageContent.html',
        controller: function($scope) {
            $scope.convertMarkdown = function (string) {
                var md = $showdown.makeHtml(string);
                return md;
            };
        }
    };
}]);