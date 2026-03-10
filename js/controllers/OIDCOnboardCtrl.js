angular.module('OIDCOnboardCtrl', []).controller('OIDCOnboardCtrl', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
    $scope.challengeId = '';
    $scope.mode = 'choose';
    $scope.providerProfile = {};
    $scope.provider = 'OpenID';

    $scope.linkData = {
        username: '',
        password: ''
    };

    $scope.formData = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        conf_password: "",
        RCS: "",
        RIN: "",
        phone: "",
        c_phone: "",
        rpi_add: "",
        home_add: "",
        dob: "",
        user_name: ""
    };

    $scope.datepicker = {
      options: {
        formatYear: 'yy',
        maxDate: new Date(),
        minDate: new Date(1800, 1, 1),
        startingDay: 0
      },
      opened: false
    };

    $scope.openDatepicker = function() {
      $scope.datepicker.opened = !$scope.datepicker.opened;
    };

    $scope.useLinkExisting = function () {
        $scope.mode = 'link';
        $scope.linkData.username = $scope.formData.user_name || '';
    };

    $scope.useCreateNew = function () {
        $scope.mode = 'create';
    };

    $scope.backToChoose = function ($event) {
        if ($event) {
            $event.preventDefault();
            $event.stopPropagation();
        }
        $scope.linkData.password = '';
        $scope.mode = 'choose';
    };

    $scope.submitOidcLink = function () {
        AuthService.linkOidcAccount({
            challenge_id: $scope.challengeId,
            username: $scope.linkData.username,
            password: $scope.linkData.password
        }).then(function () {
            $location.search({});
            $location.path('/night-crews');
        }, function (error) {
            var msg = (error.data && error.data.error) ? error.data.error : 'Unable to link account.';
            sweetAlert("Link Failed", msg, "error");
        });
    };

    $scope.submitCreateForm = function () {
        if ($scope.formData.password !== $scope.formData.conf_password) {
            sweetAlert("Password Mismatch!", "Your passwords do not match. Please try again.", "error");
            return;
        }

        var payload = {
            username: $scope.formData.user_name,
            password: $scope.formData.password,
            first_name: $scope.formData.first_name,
            last_name: $scope.formData.last_name,
            dob: $scope.formData.dob,
            email: $scope.formData.email,
            rcs_id: $scope.formData.RCS,
            rin: $scope.formData.RIN,
            rpi_address: $scope.formData.rpi_add,
            home_address: $scope.formData.home_add,
            cell_phone: $scope.formData.c_phone,
            home_phone: $scope.formData.phone
        };

        AuthService.createOidcAccount({
            challenge_id: $scope.challengeId,
            data: payload
        }).then(function () {
            $location.search({});
            $location.path('/night-crews');
        }, function (error) {
            var msg = (error.data && error.data.error) ? error.data.error : 'Unable to create account.';
            sweetAlert("Create Failed", msg, "error");
        });
    };

    function applyPrefill(prefill) {
        if (!prefill) {
            return;
        }
        $scope.formData.first_name = prefill.first_name || $scope.formData.first_name;
        $scope.formData.last_name = prefill.last_name || $scope.formData.last_name;
        $scope.formData.email = prefill.email || $scope.formData.email;
        $scope.formData.user_name = prefill.username || $scope.formData.user_name;
    }

    function initializeChallenge() {
        var params = $location.search();
        if (!params.challenge) {
            sweetAlert("OpenID Login Error", "Missing onboarding challenge.", "error");
            $location.path('/login');
            return;
        }

        $scope.challengeId = params.challenge;

        AuthService.getOidcChallenge($scope.challengeId).then(function (response) {
            var data = response.data || {};
            if (!data.success) {
                sweetAlert("OpenID Login Error", "Unable to load onboarding challenge.", "error");
                $location.path('/login');
                return;
            }

            $scope.providerProfile = data.profile || {};
            applyPrefill(data.prefill || {});
        }, function (error) {
            var msg = (error.data && error.data.error) ? error.data.error : 'Unable to load onboarding challenge.';
            sweetAlert("OpenID Login Error", msg, "error");
            $location.path('/login');
        });
    }

    AuthService.getOidcConfig().then(function (response) {
        if (response.data && response.data.provider) {
            $scope.provider = response.data.provider;
        }
    }).finally(function () {
        initializeChallenge();
    });
}]);
