var ctrl_name = 'GameCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', '$http', '$location', '$route', '$routeParams', 'AuthService', '$window', function($scope, $http, $location, $route, $routeParams, AuthService, $window) {
    $scope.back = function() {
        $window.history.back();
    };

    $scope.load = function() {
        $scope.loaded = false;
        AuthService.isAdmin().then(function (response) {
            $scope.admin = response.admin === '1';
        });

        $scope.positions = [];
        $scope.filtered = {};

        $http({
            method: 'POST',
            url: '.get_game_info.php',
            data: "session_id=" + AuthService.getSessionId() + "&game_id=" + $routeParams.gameId,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            if (!response.data.success) {
                console.log("it failed!");
                console.log(response.data);
                $location.url('/games-events');
            } else {
                console.log(response.data);
                $scope.attendees = response.data.attendees;
                $scope.game = response.data.game;
                $scope.alreadySignedUp = response.data.alreadySignedUp;
                $scope.eligiblePositions = response.data.eligiblePositions;
                $scope.currentPosition = response.data.currentPosition;

                $scope.game.startObj = new Date(parseInt($scope.game.start_epoch) * 1000);
                $scope.game.endObj = new Date(parseInt($scope.game.end_epoch) * 1000);

                $scope.positions = [
                    { title: 'Crew Chief', value: 'cc' },
                    { title: 'Driver', value: 'driver' },
                    { title: 'Attendant', value: 'attendant' },
                    { title: 'Observer', value: 'observer' }
                ];

                if($scope.game.ees === '1') {
                    $scope.positions.unshift({ title: 'EES', value: 'ees' });
                }

                $scope.loaded = true;
            }
        });
    };
    $scope.load();

    $scope.signup = function (position) {
        if($scope.alreadySignedUp && $scope.currentPosition === position) {
            return;
        }

        $http({
            method: 'POST',
            url: '.signup_game.php',
            data: 'session_id=' + AuthService.getSessionId() + '&game_id=' + $routeParams.gameId + '&position=' + position,
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
            url: '.drop_game.php',
            data: 'session_id=' + AuthService.getSessionId() + '&game_id=' + $routeParams.gameId,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            console.log(response);
            $route.reload();
        });
    };

    $scope.dropMember = function (memberid) {
        if(!$scope.admin) {
            return;
        }

        $http({
            method: 'POST',
            url: '.drop_game_other_member.php',
            data: 'session_id=' + AuthService.getSessionId() + '&game_id=' + $routeParams.gameId + '&member_id=' + memberid,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            console.log(response.data);
            $route.reload();
        });
    };

    $scope.deleteGame = function () {
          if(!$scope.admin) {
              return;
          }
          sweetAlert({
              title: "Are you sure?",
              text: "This action will permanently delete the game " + $scope.game.description + ". Do you want to proceed?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#c52d2f",
              confirmButtonText: "Delete",
              closeOnConfirm: false
          }, function () {
              $http({
                  method: 'POST',
                  url: '.delete_game.php',
                  data: 'session_id=' + AuthService.getSessionId() + '&game_id=' + $routeParams.gameId,
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }).then(function (response) {
                  sweetAlert("Deleted!", "The game " + $scope.game.description + " has been deleted.", "success");
                  $location.url('/games-events');
              });
          });
      }

      $scope.editGame = function () {
        if(!$scope.admin) {
            return;
        }
          $location.url('/edit/game/' + $routeParams.gameId);
      }

}]);
