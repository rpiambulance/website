angular.module('LoginCtrl', []).controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.formData = {
        username: "",
        password: ""
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

    $scope.submitForm = function () {

        $http({
            method: 'POST',
            url: '.login.php',
            data: autocompleteValidate(), // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
        }).success(function (data) {
            console.log(data);
            if (!data.success) {
                console.log("it failed!");
                // if not successful, bind errors to error variables
                if(data.errors.username) {
                    $scope.errorUser = data.errors.username;
                }
                if(data.errors.password) {
                    $scope.errorPass = data.errors.password;
                }

                $scope.submission = true; //shows the error message
            } else {
                $scope.showContactSuccess = true;
                // if successful, bind success message to message
                $scope.submissionMessage = data.messageSuccess;
                $scope.formData = {}; // form fields are emptied with this line
                $scope.submission = true; //shows the success message
            }
        });
    };


}]);