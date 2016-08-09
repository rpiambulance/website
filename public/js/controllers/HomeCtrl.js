angular.module('HomeCtrl', []).controller('HomeCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.readMore = function () {
        $('#main-slider').carousel('pause');
        $location.path('/' + $('.item.active').attr('id'));
    }
}]);
