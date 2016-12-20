angular.module('LoginCtrl', []).controller('LoginCtrl', ['$scope', '$http', '$window', '$cookies', 'AuthService', function($scope, $http, $window, $cookies, AuthService) {
    $scope.formData = {
        username: "",
        password: ""
    };



    // var autocompleteValidate = function () {
    //     console.log("Ran this thing.");
    //     var corrected = {};
    //     for (var d in $scope.formData) {
    //         if($scope.formData.hasOwnProperty(d)) {
    //             if(document.getElementById(d).value !== $scope.formData[d]) {
    //                 corrected[d] = document.getElementById(d).value;
    //             } else {
    //                 corrected[d] = $scope.formData[d];
    //             }
    //         }
    //     }
    //     return corrected;
    // };

    $scope.clearForm = function () {
        for (var d in $scope.formData) {
            if ($scope.formData.hasOwnProperty(d))
                $scope.formData[d] = "";
        }
    };

    $scope.submitForm = function () {
        console.log("Submit");
        AuthService.login($scope.formData);
    };
}]);
