angular.module('FuelLogCtrl', []).controller('FuelLogCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.formData = {
        name: "",
        email: ""
    };

    var autocompleteValidate = function () {
        var corrected = {};
        for (var d in $scope.formData) {
            if($scope.formData.hasOwnProperty(d)) {
                if(document.getElementById(d).value !== $scope.formData[d]) {
                    corrected[d] = document.getElementById(d).value;
                } else {
                    corrected[d] = $scope.formData[d];
                }
            }
        }
        return corrected;
    };

    $scope.clearForm = function () {
        for (var d in $scope.formData) {
            if ($scope.formData.hasOwnProperty(d))
                $scope.formData[d] = "";
        }
    };

    $scope.vehicle = {
        Amb: false,
        FR59: false
    };


    $scope.getDatetime = new Date();

}]);


