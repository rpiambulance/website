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

    console.log($scope.formData);

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
            }).success(function (data) {
                if (!data.success) {
                    console.log("it failed!");
                    console.log(data);

                    $scope.submission = true; //shows the error message
                    $scope.showError= true;
                } else {
                    $scope.showContactSuccess = true;
                    // if successful, bind success message to message
                    $scope.submissionMessage = data.messageSuccess;
                    $scope.formData = {}; // form fields are emptied with this line
                    $scope.submission = true; //shows the success message
                }
            });
        }
        else{
            console.log("Stupid Human");
        }
    };



}]);
