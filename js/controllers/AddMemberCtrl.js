angular.module('AddMemberCtrl', []).controller('AddMemberCtrl', ['$scope', '$http', 'AuthService', function($scope, $http, AuthService) {
    $scope.provider = 'OpenID';

    AuthService.getOidcConfig().then(function (response) {
        if (response.data && response.data.provider) {
            $scope.provider = response.data.provider;
        }
    });

    $scope.formData = {
        first_name: "",
        last_name: "",
        email: "",
        user_name: ""
    };

    $scope.clearForm = function () {
        for (var d in $scope.formData) {
            if ($scope.formData.hasOwnProperty(d))
                $scope.formData[d] = "";
        }
    };

    $scope.submitForm = function () {
        $http({
            method: 'POST',
            url: '.add_member.php?session_id=' + AuthService.getSessionId(),
            data: $scope.formData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (data) {
            if (!data.data.success) {
                $scope.submission = true;
                $scope.showError= true;
                var alertText = "That didn't go quite right. Please check the form and try again. Error: " + (data.data.error || 'Unknown error');
                sweetAlert("Oops!", alertText, "error");
            } else {
                $scope.successName = $scope.formData.first_name + ' ' + $scope.formData.last_name;
                $scope.showContactSuccess = true;
                $scope.submissionMessage = data.messageSuccess;
                $scope.formData = {
                    first_name: "",
                    last_name: "",
                    email: "",
                    user_name: ""
                };
                $scope.submission = true;
                sweetAlert($scope.provider + " Account Created!", "An email has been sent to the user's email address to complete setup.", "success");
            }
        });
    };
}]);
