angular.module('LoginCtrl', []).controller('LoginCtrl', ['$scope', '$http', '$location', '$cookies', 'AuthService', function($scope, $http, $location, $cookies, AuthService) {
    $scope.formData = {
        username: "",
        password: ""
    };

    $scope.showError = false;
    $scope.errorMessage = '';

    $scope.clearForm = function () {
        for (var d in $scope.formData) {
            if ($scope.formData.hasOwnProperty(d))
                $scope.formData[d] = "";
        }
    };

    $scope.submitForm = function () {
        console.log("Submit");
        AuthService.login($scope.formData).then(function (response) {
            console.log('here1');
            $location.path('/night-crews');
        }, function (error) {
            console.log('here2', error);
            sweetAlert("Houston, we have a problem!", error.data.errors.credentials, "error");
            $scope.errorMessage= error.data.errors.credentials;
            $scope.showError = true;
        })
    };
}]);
