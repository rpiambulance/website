var ctrl_name = 'AddEventCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', '$http', function($scope, $http) {

  $scope.formData = {
      event_name: "",
      event_location: "",
      start_time: "",
      end_time: "",
      date: "",
      type: "",
      limit: ""
  };

  console.log($scope.formData);

  $scope.clearForm = function () {
      for (var d in $scope.formData) {
          if ($scope.formData.hasOwnProperty(d))
              $scope.formData[d] = "";
      }
  };

  $scope.submitForm = function () {

      console.log("Submitted");
      console.log($scope.formData);

      if($scope.formData.type == 2 || $scope.formData.type == 3) {

        // Game creation

          console.log($scope.formData);
          $http({
              method: 'POST',
              url: '.add_game.php',
              data: $scope.formData, // pass in data as strings
              headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
          }).then(function (data) {
              if (!data.data.success) {
                  console.log("it failed!");
                  console.log(data);

                  $scope.submission = true; //shows the error message
                  $scope.showError= true;
              } else {
                  console.log("it succeeded!");
                  $scope.successName = $scope.formData.first_name + ' ' + $scope.formData.last_name;
                  $scope.showContactSuccess = true;
                  // if successful, bind success message to message
                  $scope.submissionMessage = data.messageSuccess;
                  $scope.formData = {}; // form fields are emptied with this line
                  $scope.submission = true; //shows the success message
                  sweetAlert("Game Added!", "Your game: " +$scope.formData.event_name + " was added to the calendar.", "success");
              }
          });
      }
      else{
        // Event creation here
        $http({
            method: 'POST',
            url: '.add_event.php',
            data: $scope.formData, // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
        }).then(function (data) {
            if (!data.data.success) {
                console.log("it failed!");
                console.log(data);

                $scope.submission = true; //shows the error message
                $scope.showError= true;
            } else {
                console.log("it succeeded!");
                $scope.successName = $scope.formData.first_name + ' ' + $scope.formData.last_name;
                $scope.showContactSuccess = true;
                // if successful, bind success message to message
                $scope.submissionMessage = data.messageSuccess;
                $scope.formData = {}; // form fields are emptied with this line
                $scope.submission = true; //shows the success message
                sweetAlert("Game Added!", "Your game: " +$scope.formData.event_name + " was added to the calendar.", "success");
            }
        });
      }
  };


}]);
