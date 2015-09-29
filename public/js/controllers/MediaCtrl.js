angular.module('MediaCtrl', []).controller('MediaCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'Media';
    $scope.sections = [
        {
            header: '',
            internal_title: '',
            body: '[Definitely Relevant](http://www.buzzfeed.com/skarlan/40-things-only-ems-workers-will-understand#.qtamggp76)'
        }
    ];
}]);