angular.module('OIDCLegacySetupCtrl', []).controller('OIDCLegacySetupCtrl', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
    $scope.loading = true;
    $scope.provider = 'OpenID';
    $scope.mode = 'unknown';
    $scope.setupErrorMessage = '';
    $scope.canCheckProvider = false;
    $scope.providerHasAccount = null;
    $scope.formData = {
        username: '',
        first_name: '',
        last_name: '',
        email: ''
    };

    $scope.startLink = function () {
        AuthService.startLegacyOidcLink();
    };

    $scope.submitCreate = function () {
        AuthService.createLegacyOidcAccount($scope.formData).then(function () {
            sweetAlert("Account Linked", "Your " + $scope.provider + " account was created and linked. Check your email for instructions to complete account setup.", "success");
            $location.search({});
            $location.path('/night-crews');
        }, function (error) {
            var msg = (error.data && error.data.error) ? error.data.error : 'Unable to create and link provider account. Contact dev@rpiambulance.com for assistance.';
            sweetAlert("Setup Failed", msg, "error");
        });
    };

    $scope.signOut = function () {
        AuthService.logout();
    };

    $scope.continueWithLegacy = function () {
        $location.search({});
        $location.path('/night-crews');
    };

    function initialize() {
        AuthService.getLegacyOidcStatus().then(function (response) {
            var data = response.data || {};
            if (!data.success) {
                $scope.mode = 'unknown';
                $scope.setupErrorMessage = "Unable to load account setup status. You can continue with your legacy sign-in for now.";
                return;
            }

            $scope.provider = data.provider || 'OpenID';
            $scope.mode = data.action || 'unknown';
            $scope.canCheckProvider = !!data.can_check_provider;
            $scope.providerHasAccount = data.provider_has_account;
            $scope.formData.username = data.user ? (data.user.username || '') : '';
            $scope.formData.first_name = data.user ? (data.user.first_name || '') : '';
            $scope.formData.last_name = data.user ? (data.user.last_name || '') : '';
            $scope.formData.email = data.user ? (data.user.email || '') : '';

            if ($scope.mode === 'none') {
                $location.search({});
                $location.path('/night-crews');
                return;
            }
        }, function (error) {
            var msg = (error.data && error.data.error) ? error.data.error : 'Unable to load account setup status.';
            $scope.mode = 'unknown';
            $scope.setupErrorMessage = msg + " You can continue with your legacy sign-in for now.";
        }).finally(function () {
            $scope.loading = false;
        });
    }

    initialize();
}]);
