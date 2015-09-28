angular.module('pageContent', []).directive('pageContent', ['$showdown', function($showdown) {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'js/directives/pageContent.html',
        controller: function($scope) {
            var addImageClasses = function(string) {
                var search_query = '<img',
                    to_add = ' class="img-responsive center-block"',
                    img_location = string.indexOf(search_query);
                while(img_location != -1) {
                    string = [string.slice(0, img_location+search_query.length), to_add, string.slice(img_location+search_query.length)].join('');
                    img_location = string.indexOf(search_query, img_location+search_query.length);
                }
                return string;
            };
            $scope.convertMarkdown = function (string) {
                var md = $showdown.makeHtml(string);
                md = addImageClasses(md);
                return md;
            };
        }
    };
}]);