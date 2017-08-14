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
        AuthService.login($scope.formData).then(function (response) {
            $location.path('/night-crews');
        }, function (error) {
            if (error.data.fail_type == "locked") {
              sweetAlert("Account Disabled", error.data.errors.locked, "error");
            }
            else if (error.data.fail_type == "incomplete") {
              if (error.data.errors.username) {
                sweetAlert(error.data.errors.username, error.data.errors.incomplete, "error")
              }
              else if (error.data.errors.password) {
                sweetAlert(error.data.errors.password, error.data.errors.incomplete, "error")
              }
            }
            else{
            sweetAlert("Houston, we have a problem!", error.data.errors.credentials, "error");
            $scope.errorMessage= error.data.errors.credentials;
            $scope.showError = true;
          }
        })
    };
}]);
