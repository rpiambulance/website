var ctrl_name = 'AddEventCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', '$http', '$location', 'moment', '$routeParams', 'AuthService', 'moment', function($scope, $http, $location, moment, $routeParams, AuthService) {
  AuthService.getUserMetadata().then(function (data) {
      $scope.userdata = data;
      $scope.initPage();
  }, function (error) {
      $location.url('/login');
      return;
  });

  $scope.datepicker = {
    options: {
      formatYear: 'yy',
      minDate: new Date(),
      startingDay: 0
    },
    opened: false
  };

  $scope.formatTime = function (t) {
    return new Date(t.getTime() - (t.getTimezoneOffset() * 60000)).toISOString().substring(11, 19);
  }

  $scope.formatDate = function (input) {
    if(typeof input === 'number') {
      day = new Date(input)
    } else {
      day = input
    }
    day = day - day.getTimezoneOffset()*60000
    return new Date(day).toISOString().substring(0, 10)
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

  function parseDateString(string) {
    return new Date().setFullYear(string.substring(0, 4), string.substring(5, 7) - 1, string.substring(8, 10));
  }

  $scope.initPage = function() {

    AuthService.getUserMetadata().catch( function(error){
      conosle.log("CATCH");
      $location.url('/404');
    });

    if(!$routeParams.type) {
      $scope.editMode = false;
      return;
    }

    $scope.editMode = true;

    if($routeParams.type === "event") {
      $http({
              method: 'POST',
              url: '.get_event_info.php',
              data: "session_id=" + AuthService.getSessionId() + "&event_id=" + $routeParams.eventId,
              headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).then(function (response) {
              if (!response.data.success) {
                  $location.url('/games-events');
              } else {
                  $scope.originalName = response.data.event.description;
                  $scope.formData.event_name = response.data.event.description;
                  $scope.formData.event_location = response.data.event.location;
                  $scope.formData.start_time = moment(`${response.data.event.date} ${response.data.event.start}`).toDate();
                  $scope.formData.end_time = moment(`${response.data.event.date} ${response.data.event.end}`).toDate();
                  $scope.formData.date = parseDateString(response.data.event.date);
                  $scope.formData.type = "1";
                  $scope.formData.limit = parseInt(response.data.event.limit);
              }
          });

    } else if ($routeParams.type === "game") {

      $http({
              method: 'POST',
              url: '.get_game_info.php',
              data: "session_id=" + AuthService.getSessionId() + "&game_id=" + $routeParams.eventId,
              headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).then(function (response) {
              if (!response.data.success) {
                  $location.url('/games-events');
              } else {
                  $scope.originalName = response.data.game.description;
                  $scope.formData.event_name = response.data.game.description;
                  $scope.formData.event_location = response.data.game.location;
                  $scope.formData.start_time = moment(`${response.data.game.date} ${response.data.game.start}`).toDate();
                  $scope.formData.end_time = moment(`${response.data.game.date} ${response.data.game.end}`).toDate();
                  $scope.formData.date = parseDateString(response.data.game.date);
                  if (response.data.game.ees = 0) {
                    $scope.formData.type = "3";
                  } else {
                    $scope.formData.type = "2";
                  }
              }
          });
    }
  }

  $scope.clearForm = function () {
      for (var d in $scope.formData) {
          if ($scope.formData.hasOwnProperty(d))
              $scope.formData[d] = "";
      }
  };

  $scope.submitForm = function () {
      $scope.formData.datestamp = $scope.formatDate($scope.formData.date)
      $scope.formData.startstamp = $scope.formatTime($scope.formData.start_time);
      $scope.formData.endstamp = $scope.formatTime($scope.formData.end_time);
      // $scope.formData['date'] =  moment($scope.formData['date'].format("YYYY-MM-DD HH:mm:ss");
      // $scope.formData.date = "POOP";


      $scope.formData.mode = ($scope.editMode ? 'edit' : 'add');

      if($scope.editMode) {
        $scope.formData.id = $routeParams.eventId;
      }

      if($scope.formData.type == 2 || $scope.formData.type == 3) {
        // Game creation

          $http({
              method: 'POST',
              url: '.add_game.php?session_id=' + AuthService.getSessionId(),
              data: $scope.formData, // pass in data as strings
              headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
          }).then(function (data) {
              if (!data.data.success) {


                  $scope.submission = true; //shows the error message
                  $scope.showError= true;
              } else {
                  $scope.successName = $scope.formData.first_name + ' ' + $scope.formData.last_name;
                  $scope.showContactSuccess = true;
                  // if successful, bind success message to message
                  $scope.submissionMessage = data.messageSuccess;
                  if($scope.editMode) {
                    sweetAlert("Game Updated!", "Your game, entitled " +$scope.formData.event_name + ", was updated on the calendar.", "success");
                    $location.url('/game/' + $routeParams.eventId);
                  } else {
                    sweetAlert("Game Added!", "Your game, entitled " +$scope.formData.event_name + " was added to the calendar.", "success");
                    $scope.formData = {}; // form fields are emptied with this line
                    $scope.submission = true; //shows the success message
                  }
              }
          });
      } else {
        // Event creation here
        $http({
            method: 'POST',
            url: '.add_event.php?session_id=' + AuthService.getSessionId(),
            data: $scope.formData, // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
        }).then(function (data) {
            if (!data.data.success) {
                $scope.submission = true; //shows the error message
                $scope.showError= true;
            } else {
                $scope.successName = $scope.formData.first_name + ' ' + $scope.formData.last_name;
                $scope.showContactSuccess = true;
                // if successful, bind success message to message
                $scope.submissionMessage = data.messageSuccess;
                if($scope.editMode) {
                  sweetAlert("Event Updated!", "Your event, entitled " +$scope.formData.event_name + ", was updated on the calendar.", "success");
                  $location.url('/event/' + $routeParams.eventId);
                } else {
                  sweetAlert("Event Added!", "Your event, entitled " +$scope.formData.event_name + ", was added to the calendar.", "success");
                  $scope.formData = {}; // form fields are emptied with this line
                  $scope.submission = true; //shows the success message
                }
            }
        });
      }
  };

  $scope.returnToEvent = function () {
    if($scope.editMode) {
      $location.url('/' + ($scope.formData.type == 1 ? 'event' : 'game') + '/' + $routeParams.eventId);
    }
  };
}]);
