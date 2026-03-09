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
        AuthService.login($scope.formData).then(function (response) {
            var data = (response && response.data) ? response.data : {};
            if (data.oidc_setup_required) {
                $location.search({action: data.oidc_setup_action || 'link'});
                $location.path('/oidc-legacy-setup');
                return;
            }
            $location.path('/night-crews');
        }, function (error) {
            var data = (error && error.data) ? error.data : {};
            var failType = data.fail_type || '';
            var errors = data.errors || {};
            var fallbackMessage = "Unable to log in right now. Please try again or contact officers@rpiambulance.com.";

            if (failType == "locked") {
                sweetAlert("Account Disabled", errors.locked || fallbackMessage, "error");
            }
            else if (failType == "incomplete") {
                if (errors.username) {
                    sweetAlert(errors.username, errors.incomplete || fallbackMessage, "error");
                }
                else if (errors.password) {
                    sweetAlert(errors.password, errors.incomplete || fallbackMessage, "error");
                }
                else {
                    sweetAlert("Login Incomplete", errors.incomplete || fallbackMessage, "error");
                }
            }
            else if (failType == "oidc_only") {
                sweetAlert("Use " + $scope.oidc.provider + " Login", errors.oidc_only || fallbackMessage, "error");
            }
            else if (failType == "inactive") {
                sweetAlert("Account Inactive", errors.inactive || fallbackMessage, "error");
            }
            else if (failType == "revoked") {
                sweetAlert("Access Revoked", errors.revoked || fallbackMessage, "error");
            }
            else {
                var genericMessage = errors.credentials || fallbackMessage;
                sweetAlert("Houston, we've had a problem!", genericMessage, "error");
                $scope.errorMessage = genericMessage;
                $scope.showError = true;
            }
        });
    };

    $scope.startOidcLogin = function () {
        AuthService.startOidcLogin();
    };

    function initializeOidcConfig() {
        return AuthService.getOidcConfig().then(function (response) {
            if (response.data) {
                $scope.oidc.enabled = !!response.data.enabled;
                $scope.oidc.provider = response.data.provider || 'OpenID';
            }
        });
    }

    function initializeOidcChallenge() {
        var params = $location.search();
        if (params.oidc_error) {
            sweetAlert($scope.oidc.provider + " Login Error", params.oidc_error, "error");
        }
        if (params.oidc_challenge) {
            $location.path('/oidc-onboard');
            $location.search({challenge: params.oidc_challenge});
        }
    }

    initializeOidcConfig().then(function () {
        initializeOidcChallenge();
    }, function () {
        initializeOidcChallenge();
    });
}]);
