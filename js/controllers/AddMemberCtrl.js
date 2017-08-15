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
        home_add: "",
        dob: "",
        user_name: ""
    };

    $scope.datepicker = {
      options: {
        formatYear: 'yy',
        maxDate: new Date(),
        minDate: new Date(1800, 1, 1),
        startingDay: 1
      },
      opened: false
    };

    $scope.formatTime = function (t) {
      return new Date(t.getTime() - (t.getTimezoneOffset() * 60000)).toISOString().substring(11, 19);
    }

    $scope.openDatepicker = function() {
      $scope.datepicker.opened = !$scope.datepicker.opened;
    };


    $scope.clearForm = function () {
        for (var d in $scope.formData) {
            if ($scope.formData.hasOwnProperty(d))
                $scope.formData[d] = "";
        }
    };

    $scope.submitForm = function () {
        if($scope.formData.password == $scope.formData.conf_password) {


            console.log($scope.formData);
            $http({
                method: 'POST',
                url: '.add_member.php',
                data: $scope.formData, // pass in data as strings
                headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
            }).then(function (data) {
                if (!data.data.success) {
                    console.log("it failed!");

                    $scope.submission = true; //shows the error message
                    $scope.showError= true;
                    sweetAlert("Oops!", "That didn't go quite right. Please check to make sure everything was filled out correclty.", "error");
                } else {
                    console.log("it succeeded!");
                    $scope.successName = $scope.formData.first_name + ' ' + $scope.formData.last_name;
                    $scope.showContactSuccess = true;
                    // if successful, bind success message to message
                    $scope.submissionMessage = data.messageSuccess;
                    $scope.formData = {}; // form fields are emptied with this line
                    $scope.submission = true; //shows the success message
                    sweetAlert("Welcome!", "Thanks for joining our team! We look forward to seeing you around!", "success");
                }
            });
        }
        else{
            console.log("Stupid Human");
        }
    };



}]);
