angular.module('NightCrewsCtrl', []).controller('NightCrewsCtrl', ['$scope', '$http', '$location', 'AuthService', function ($scope, $http, $location, AuthService) {

    $scope.activeWeek = true;

    AuthService.getUserMetadata().then(function (data) {
        $scope.username = data.username;
        $scope.crewchief = data.crewchief == 1;
        $scope.cctrainer = data.cctrainer == 1;
        $scope.backupcc = data.backupcc == 1;
        $scope.driver = data.driver == 1;
        $scope.drivertrainer = data.drivertrainer == 1;
        $scope.loadCrews();
    }, function (error) {
        $location.url('/login');
        return;
    });

    $scope.tables = [
        {
            attribute: 'currentWeek',
            title: 'Current Week'
        }, {
            attribute: 'nextWeek',
            title: 'Upcoming Week'
        }
    ];

    $scope.loadCrews = function() {
        if(!AuthService.getSessionId()) {
            $location.url('/login');
            return;
        }

        $scope.loadedCrews = false;
        $http({
            method: 'POST',
            url: '.crews.php',
            data: "session_id=" + AuthService.getSessionId(),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            if (!response.data.success) {
                console.log("it failed!");
                console.log(response.data);
            } else {
                // Since the crews come in order of latest first, we need to separate
                // them in a way that almost seems backwards.

                $scope.tableHeadings = response.data.headings;
                $scope.crews = response.data.crews;
                // $scope.currentWeekCrews = response.data.currentWeek;
                // $scope.upcomingWeekCrews = response.data.nextWeek;
                $scope.positions = response.data.positions;

                $scope.loadedCrews = true;
            }
        });
    };


    $scope.number = 7;
    $scope.getNumber = function (num) {
        return new Array(num);
    };

    var crewAction = function (a, s) {
        var data = a + '=true';
        data += '&crewid=' + s.crewid;
        data += '&position=' + s.position;
        data += '&signature=' + s.signature;
        data += '&session_id=' + AuthService.getSessionId();

        $http({
            method: 'POST',
            url: '.crews.php',
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            console.log(response.data);
            if(response.data == "true") {
                $scope.loadCrews();
            } else {
                alert('Something went wrong...');
            }
        });
    }

    $scope.confirmCrew = function (spot) {
        if(!spot || !spot.vacant || !spot.eligible) {
            return false;
        }

        crewAction('confirmcrew', spot);
    };

    $scope.clearCrew = function (spot, clear) {
        if(!spot || !clear || spot.vacant) {
            return false;
        }

        crewAction('clearcrew', clear);
    };
}]);
