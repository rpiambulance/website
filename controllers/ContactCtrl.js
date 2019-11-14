angular.module('ContactCtrl', []).controller('ContactCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.formData = {
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    };

    sweetAlert("Heads up!", "Due to some changes with our hosting service, our email forms are currently not working. We are trying our best to resolve the issue. For now, please contact us directly at officers@rpiambulance.com.", 'error');


    var autocompleteValidate = function () {
        var corrected = {};
        for (var d in $scope.formData) {
            if($scope.formData.hasOwnProperty(d)) {
                if(document.getElementById(d).value !== $scope.formData[d] && d != "g-recaptcha-response") {
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
        if(!document.getElementById("g-recaptcha-response")) {
            return;
        }

        $scope.formData["g-recaptcha-response"] = document.getElementById("g-recaptcha-response").value;

        $http({
            method: 'POST',
            url: '.contact_submit.php',
            data: autocompleteValidate(), // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
        }).success(function (data) {
            if (!data.success) {
                console.log("it failed!");
                // if not successful, bind errors to error variables
                if(data.errors.name) {
                    $scope.errorName = data.errors.name;
                }
                if(data.errors.email) {
                    $scope.errorEmail = data.errors.email;
                }
                if(data.errors.message) {
                    $scope.errorTextarea = data.errors.message;
                }
                if(data.messageError) {
                    $scope.submissionMessage = data.messageError;
                }

                $scope.submission = true; //shows the error message
            } else {
                $scope.showContactSuccess = true;
                // if successful, bind success message to message
                $scope.submissionMessage = data.messageSuccess;
                $scope.formData = {}; // form fields are emptied with this line
                $scope.submission = true; //shows the success message
                sweetAlert("Message Sent!", "Thanks for reaching out to us. You should have received a copy of your email to the address you provided. One of our members should be in touch with you shortly.", "success");
            }
        });
    };
}]);
