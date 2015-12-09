angular.module('CoverageCtrl', []).controller('CoverageCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'Request Coverage';
    $scope.sections = [
        {
            header: '',
            internal_title: '',
            body: '[Definitely Relevant](http://www.buzzfeed.com/skarlan/40-things-only-ems-workers-will-understand#.qtamggp76)'
        }
    ];
}]);