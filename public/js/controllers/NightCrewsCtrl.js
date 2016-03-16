angular.module('NightCrewsCtrl', []).controller('NightCrewsCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.number= 7;
    $scope.getNumber = function(num) {
        return new Array(num);
    }

}]);