angular.module('FuelLogCtrl', []).controller('FuelLogCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.formData = {
        name: "",
        date: $scope.getDatetime,
        qty: "",
        mileage: "",
        vehicle: ""
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

    $scope.vehicle = {
        Amb: false,
        FR59: false
    };


    $scope.getDatetime = new Date();



    $scope.submitForm = function () {
        if(!document.getElementById("g-recaptcha-response")) {
            return;
        }

        $scope.formData["g-recaptcha-response"] = document.getElementById("g-recaptcha-response").value;

        if ($scope.vehicle["Amb"] == true) {
            $scope.formData["vehicle"]= "5939"
        }
        else if ($scope.vehicle["FR59"] == true) {
            $scope.formData["vehicle"]= "FR-59"
        }

        $http({
            method: 'POST',
            url: '.fuel.php',
            data: $scope.formData, // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
        }).success(function (data) {
            if (!data.success) {
                console.log("it failed!");
                // if not successful, bind errors to error variables

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
