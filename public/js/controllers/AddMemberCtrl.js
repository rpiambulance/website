angular.module('AddMemberCtrl', []).controller('AddMemberCtrl', ['$scope', '$http', function($scope, $http) {


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
        h_add: "",
        dob: "",
        user_name: ""
    };

    var autocompleteValidate = function () {
        console.log($scope.formData);
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
            url: '.add_member.php',
            //data: autocompleteValidate(), // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
        }).success(function (data) {
            if (!data.success) {
                console.log("it failed!");
                // if not successful, bind errors to error variables
                //if(data.errors.name) {
                //    $scope.errorName = data.errors.name;
                //}
                //if(data.errors.email) {
                //    $scope.errorEmail = data.errors.email;
                //}
                //if(data.errors.message) {
                //    $scope.errorTextarea = data.errors.message;
                //}
                //if(data.messageError) {
                //    $scope.submissionMessage = data.messageError;
                //}

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