angular.module('StockingIssueCtrl', []).controller('StockingIssueCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.facilities= [
    'Houston Field House PCF', 'ECAV PCF', '5939', 'FR-59', 'Station 59',
    'Garage', 'Other (Describe)'
  ]

  $scope.formData = {
        name: "",
        facility: "",
        items: ""
  };

  $scope.submitForm = function(){
    $http({
            method: 'POST',
            url: '.stocking.php',
            data: $scope.formData, // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
        }).then(function (data) {
            if (!data.data.success) {
                console.log("it failed!");
                console.log(data);
                // if not successful, bind errors to error variables
                $scope.submission = true; //shows the error message
            } else {
                $scope.showContactSuccess = true;
                // if successful, bind success message to message
                $scope.submissionMessage = data.data.messageSuccess;
                $scope.formData = {}; // form fields are emptied with this line
                $scope.submission = true; //shows the success message
            }
        });
  };


}]);
