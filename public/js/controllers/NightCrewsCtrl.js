angular.module('NightCrewsCtrl', []).controller('NightCrewsCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.crew;
    $scope.number = 7;
    $scope.getNumber = function (num) {
        return new Array(num);
    };

    var autocompleteValidate = function () {
        var corrected = {};
        for (var d in $scope.formData) {
            if ($scope.formData.hasOwnProperty(d)) {
                if (document.getElementById(d).value !== $scope.formData[d] && d != "g-recaptcha-response") {
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
        data.success = true;
        if (!data.success) {
            console.log(data);
            console.log("it failed!");
            // if not successful, bind errors to error variables

            $scope.submission = true; //shows the error message
        } else {
            $scope.crew = data;
            for (var i=0; i<7; i++){
                $scope.crew[i].date= format($scope.crew[i].date);
            }
        }
    });

    function format(inputDate) {
        var date = new Date(inputDate);
        if (!isNaN(date.getTime())) {
            var day = date.getDate().toString();
            var month = (date.getMonth() + 1).toString();
            // Months use 0 index.

            return (month[1] ? month : '0' + month[0]) + '/' +
                (day[1] ? day : '0' + day[0]) + '/' +
                date.getFullYear().toString().substr(2,2);
        }
    }


}]);