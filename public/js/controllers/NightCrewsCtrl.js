angular.module('NightCrewsCtrl', []).controller('NightCrewsCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.number= 7;
    $scope.getNumber = function(num) {
        return new Array(num);
    };

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

    $http({
        method: 'POST',
        url: '.crews.php',
        data: autocompleteValidate(), // pass in data as strings
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        // set the headers so angular passing info as form data (not request payload)
    }).success(function (data) {
        data.success= true;
        if (!data.success) {
            console.log(data);
            console.log("it failed!");
            // if not successful, bind errors to error variables

            $scope.submission = true; //shows the error message
        } else {
           console.log(data);
        }
    });


}]);