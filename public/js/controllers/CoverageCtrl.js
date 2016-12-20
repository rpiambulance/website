angular.module('CoverageCtrl', []).controller('CoverageCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.showModal = false;
    $scope.currentTier = "";
    $scope.submission = false;
    $scope.formData = {
        orgName: "",
        name: "",
        phone: "",
        eventName: "",
        loc: "",
        date: "",
        time: "",
        type: "",
        attendance: "",
        duration: ""
    };

    $scope.getAttendanceLims = function () {
        return {
            "Tier I": "15-99",
            "Tier II": "100-4999",
            "Tier III": "5000+"
        }[$scope.currentTier];
    };

    $scope.toggleModal = function (id) {
        $scope.currentTier = id;
        $scope.showModal = !$scope.showModal;
        if ($scope.showModal == false && $scope.sumbission == false) {
            sweetAlert("Heads up!", "You've just closed the form, but have not submitted anything.", "error");
        }
    };

    var autocompleteValidate = function () {
        var corrected = {};
        for (var d in $scope.formData) {
            if($scope.formData.hasOwnProperty(d) && d != 'tier') {
                if(document.getElementById(d).value !== $scope.formData[d] && d != "g-recaptcha-response") {
                    corrected[d] = document.getElementById(d).value;
                } else {
                    corrected[d] = $scope.formData[d];
                }
            } else if(d == 'tier') {
                corrected[d] = $scope.formData[d];
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
        $scope.formData.tier = $scope.currentTier;
        console.log(autocompleteValidate());
        $http({
            method: 'POST',
            url: '.email_submit.php',
            data: autocompleteValidate(), // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
        }).success(function (data) {
            console.log(data);
            if (!data.success) {
                console.log("it failed!");
                // if not successful, bind errors to error variables
                if(data.errors.name) {
                    $scope.errorName = data.errors.name;
                }
                if(data.messageError) {
                    $scope.submissionMessage = data.messageError;
                }
                sweetAlert("Heads up!", "You've just closed the form, but have not submitted anything. Please make sure all fields are filled out and that you have completed the Captcha.", "error");
                $scope.submission = true; //shows the error message
            } else {
                $scope.showCoverageSuccess = true;
                // if successful, bind success message to message
                $scope.submissionMessage = data.messageSuccess;
                $scope.formData = {}; // form fields are emptied with this line
                $scope.submission = true; //shows the success message
                sweetAlert("Thanks!", "Thanks for submitting a request for EMS coverage. You should have received a copy of your reqest to the email you provided. Our Second Leiutenant should be in touch with you shortly.", "success");
            }
        });
    };
}]);
