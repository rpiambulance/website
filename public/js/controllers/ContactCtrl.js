angular.module('ContactCtrl', []).controller('ContactCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.formData = {
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: ""
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
            url: '.contact_submit.php',
            data: autocompleteValidate(), // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
        }).success(function (data) {
            if (!data.success) {
                console.log("it failed!");
                // if not successful, bind errors to error variables
                $scope.errorName = data.errors.name;
                $scope.errorEmail = data.errors.email;
                $scope.errorTextarea = data.errors.message;
                $scope.submissionMessage = data.messageError;
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