angular.module('LoginCtrl', []).controller('LoginCtrl', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
    $scope.formData = {
        username: "",
        password: ""
    };

    $scope.showError = false;
    $scope.errorMessage = '';

    $scope.oidc = {
        enabled: false,
        provider: 'OpenID'
    };

    $scope.forgotPassword = function() {
        sweetAlert("Password Reset", "To get your password reset, you will need to send an email to officers@rpiambulance.com.", "info");
    };

    $scope.clearForm = function () {
        for (var d in $scope.formData) {
            if ($scope.formData.hasOwnProperty(d)) {
                $scope.formData[d] = "";
            }
        }
    };

    $scope.submitForm = function () {
        AuthService.login($scope.formData).then(function () {
            $location.path('/night-crews');
        }, function (error) {
            if (error.data.fail_type == "locked") {
                sweetAlert("Account Disabled", error.data.errors.locked, "error");
            }
            else if (error.data.fail_type == "incomplete") {
                if (error.data.errors.username) {
                    sweetAlert(error.data.errors.username, error.data.errors.incomplete, "error");
                }
                else if (error.data.errors.password) {
                    sweetAlert(error.data.errors.password, error.data.errors.incomplete, "error");
                }
            }
            else {
                sweetAlert("Houston, we've had a problem!", error.data.errors.credentials, "error");
                $scope.errorMessage = error.data.errors.credentials;
                $scope.showError = true;
            }
        });
    };

    $scope.startOidcLogin = function () {
        AuthService.startOidcLogin();
    };

    function initializeOidcConfig() {
        AuthService.getOidcConfig().then(function (response) {
            if (response.data) {
                $scope.oidc.enabled = !!response.data.enabled;
                $scope.oidc.provider = response.data.provider || 'OpenID';
            }
        });
    }

    function initializeOidcChallenge() {
        var params = $location.search();
        if (params.oidc_error) {
            sweetAlert("OpenID Login Error", params.oidc_error, "error");
        }
        if (params.oidc_challenge) {
            $location.path('/oidc-onboard');
            $location.search({challenge: params.oidc_challenge});
        }
    }

    initializeOidcConfig();
    initializeOidcChallenge();
}]);
