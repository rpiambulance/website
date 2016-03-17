angular.module('NightCrewsCtrl', []).controller('NightCrewsCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.number= 7;
    $scope.getNumber = function(num) {
        return new Array(num);
    };


    $http.get("http://127.0.0.1:63342")
        .then(function (response) {$scope.names = response.data.records;});

}]);