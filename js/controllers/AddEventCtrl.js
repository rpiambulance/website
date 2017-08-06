var ctrl_name = 'AddEventCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', '$http', 'moment', function($scope, $http, moment) {
  $scope.datepicker = {
    options: {
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(),
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
      $scope.formData.datestamp = $scope.formData.date.toISOString().substring(0, 10);
      $scope.formData.startstamp = $scope.formatTime($scope.formData.start_time);
      $scope.formData.endstamp = $scope.formatTime($scope.formData.end_time);
      // $scope.formData['date'] =  moment($scope.formData['date'].format("YYYY-MM-DD HH:mm:ss");
      // $scope.formData.date = "POOP";

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
                  sweetAlert("Game Added!", "Your game: " +$scope.formData.event_name + " was added to the calendar.", "success");
                  $scope.formData = {}; // form fields are emptied with this line
                  $scope.submission = true; //shows the success message
              }
          });
      } else {
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
                sweetAlert("Game Added!", "Your event: " +$scope.formData.event_name + " was added to the calendar.", "success");
                $scope.formData = {}; // form fields are emptied with this line
                $scope.submission = true; //shows the success message
            }
        });
      }
  };


}]);
