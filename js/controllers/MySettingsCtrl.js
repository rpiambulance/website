angular.module('MySettingsCtrl', []).controller('MySettingsCtrl', ['$scope', '$http', 'AuthService', '$route', function($scope, $http, AuthService, $route) {
    $scope.dataReady = false;
    $scope.changePassFlag = false;
    $scope.formData = {
        fn: "",
        ln: "",
        pass: "",
        cpass: "",
        email: "",
        phone: "",
        hphone: "",
        add: "",
        hadd: "",
        session_id: ""
    }

    $scope.passChange = function () {
        $scope.changePassFlag = ($scope.formData.pass !== "" && $scope.formData.cpass !== "");
    };

    $scope.initPage = function () {
        AuthService.getUserMetadata().then(function (data) {
            $scope.formData.fn = data.first_name;
            $scope.formData.ln = data.last_name;
            $scope.formData.email = data.email;
            $scope.formData.phone = data.cell_phone;
            $scope.formData.hphone = data.home_phone;
            $scope.formData.add = data.rpi_address;
            $scope.formData.hadd = data.home_address;
            $scope.dataReady = true;
        });
    }
    $scope.initPage();

    $scope.save = function () {
        var submission = $scope.formData;
        submission.session_id = AuthService.getSessionId();

        if ($scope.changePassFlag && $scope.formData.pass !== $scope.formData.cpass) {
            sweetAlert("Whoa there!",
                       "It looks like your passwords don't quite match. Please verify that you entered all data correctly and try again", "error");
            return;
        }

        $http({
            method: 'POST',
            url: ($scope.changePassFlag ? '.edit_self_pass.php' : '.edit_self.php'),
            data: $scope.formData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            if (!response.data.success) {
                swal("Uh oh!", "Some error has occurred. Please contact the webmaster so that they can investigate.", "error");
                $scope.submission = true; //shows the error message
                $scope.showError= true;
            } else {
                swal("Success!",
                     'Your user record has been updated' +
                     ($scope.changePassFlag ? ', and your password was changed.' : '.') +
                     ' The EMS gods have been made aware of this. Please be prepared to sacrifice a hot meal.', "success");
                $route.reload();
            }
        });
    }
}]);
