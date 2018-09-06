var ctrl_name = 'EventCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', '$http', '$location', '$route', '$routeParams', 'AuthService', '$window', function($scope, $http, $location, $route, $routeParams, AuthService, $window) {
    $scope.calendarView = $location.search()['calendarView'] || 'month';

    $scope.load = function() {
        $scope.loaded = false;
        AuthService.isAdmin().then(function (response) {
            $scope.admin = response.admin === '1';
        });

        $http({
            method: 'POST',
            url: '.get_event_info.php',
            data: "session_id=" + AuthService.getSessionId() + "&event_id=" + $routeParams.eventId,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            if (!response.data.success) {
                console.log("it failed!");
                console.log(response.data);
                $location.url('/games-events');
            } else {
                $scope.attendees = response.data.attendees;
                $scope.event = response.data.event;
                $scope.alreadySignedUp = response.data.alreadySignedUp;
                $scope.currentMemberId = response.data.currentMemberId;
                $scope.event.startObj = new Date(parseInt($scope.event.start_epoch) * 1000);
                $scope.event.endObj = new Date(parseInt($scope.event.end_epoch) * 1000);
                $scope.loaded = true;
            }
        });
    };
    $scope.load();

    $scope.signup = function () {
        if($scope.alreadySignedUp) {
            return;
        }

        $http({
            method: 'POST',
            url: '.signup_event.php',
            data: 'session_id=' + AuthService.getSessionId() + '&event_id=' + $routeParams.eventId,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            console.log(response.data);
            $route.reload();
        })
    };

    $scope.drop = function () {
        if(!$scope.alreadySignedUp) {
            return;
        }

        $http({
            method: 'POST',
            url: '.drop_event.php',
            data: 'session_id=' + AuthService.getSessionId() + '&event_id=' + $routeParams.eventId,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            $route.reload();
        });
    };

    $scope.dropMember = function (memberid) {
        if(!$scope.admin) {
            return;
        }

        $http({
            method: 'POST',
            url: '.drop_event_other_member.php',
            data: 'session_id=' + AuthService.getSessionId() + '&event_id=' + $routeParams.eventId + '&member_id=' + memberid,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            $route.reload();
        });
    };

    $scope.deleteEvent = function () {
        if(!$scope.admin) {
            return;
        }
        sweetAlert({
            title: "Are you sure?",
            text: "This action will permanently delete the event " + $scope.event.description + ". Do you want to proceed?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#c52d2f",
            confirmButtonText: "Delete",
            closeOnConfirm: false
        }, function () {
            $http({
                method: 'POST',
                url: '.delete_event.php',
                data: 'session_id=' + AuthService.getSessionId() + '&event_id=' + $routeParams.eventId,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                sweetAlert("Deleted!", "The event " + $scope.event.description + " has been deleted.", "success");
                $location.url('/games-events');
            });
        });
    }

    $scope.editEvent = function () {
      if(!$scope.admin) {
          return;
      }
      $location.url('/edit/event/' + $routeParams.eventId);
       }

}]);
