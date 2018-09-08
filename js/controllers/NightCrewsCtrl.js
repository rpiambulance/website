angular.module('NightCrewsCtrl', []).controller('NightCrewsCtrl', ['$scope', '$http', '$location', 'AuthService', 'DateService', function ($scope, $http, $location, AuthService, DateService) {

    /*
     * What we're doing here is getting the current date, and then using that to get the date of the Sunday
     * of this week. We then use that to give us the Sundays of the previous and next weeks, so that we
     * can compare it against the viewDate (which undergoes similar transformations and variable creation)
     * to figure out what week the user is asking for (either default or through viewDate parameter in the URL)
     * and how it relates to the current date so that we can give nicer headers for last week, current week,
     * and next week. We set the time component to be midday so that we can match the "time" of the requested
     * viewDate against it so that we only have to worry about the date components.
     *
     * Notes:
     *  - All dates are in the local timezone
     *  - 86400000 is number of milliseconds in a day
     *  - 604800000 is the number of milliseconds in 7 days
     */
    var currentDate = new Date();
    currentDate.setHours(12, 0, 0, 0);
    $scope.currentWeek = new Date(currentDate.getTime() - (currentDate.getDay() * 86400000));
    $scope.lastWeek = new Date($scope.currentWeek.getTime() - 604800000);
    $scope.nextWeek = new Date($scope.currentWeek.getTime() + 604800000);

    $scope.viewDate = currentDate;
    var viewDate = $location.search()['viewDate'];
    if (viewDate) {
        $scope.viewDate = new Date(viewDate + " 12:00:00.000");
    }

    $scope.viewDateWeek = new Date($scope.viewDate.getTime() - ($scope.viewDate.getDay() * 86400000));
    $scope.viewDateLastWeek = new Date($scope.viewDateWeek.getTime() - 604800000);
    $scope.viewDateNextWeek = new Date($scope.viewDateWeek.getTime() + 604800000);

    // Controls the disable for the "Next Week" button, should only be disabled if we're viewing current + next weeks
    $scope.activeWeek = false;

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
    });

    $scope.tables = [];

    if ($scope.currentWeek <= $scope.viewDateWeek && $scope.viewDateWeek <= $scope.nextWeek) {
        $scope.activeWeek = true;
        $scope.tables.push({attribute: 'currentWeek', title: 'Current Week'});
        $scope.tables.push({attribute: 'nextWeek', title: 'Upcoming Week'});
    }
    else if ($scope.lastWeek <= $scope.viewDateWeek && $scope.viewDateWeek < $scope.currentWeek) {
        $scope.tables.push({attribute: 'currentWeek', title: 'Last Week'});
        $scope.tables.push({attribute: 'nextWeek', title: 'Current Week'});
    }
    else if ($scope.viewDateWeek < $scope.lastWeek && $scope.lastWeek <= $scope.viewDateNextWeek) {
        $scope.tables.push({attribute: 'currentWeek', title: 'Week of ' + DateService.formatViewDate($scope.viewDateWeek)});
        $scope.tables.push({attribute: 'nextWeek', title: 'Last Week'});
    }
    else {
        $scope.tables.push({attribute: 'currentWeek', title: 'Week of ' + DateService.formatViewDate($scope.viewDateWeek)});
        $scope.tables.push({attribute: 'nextWeek', title: 'Week of ' + DateService.formatViewDate($scope.viewDateNextWeek)});
    }

    $scope.loadCrews = function() {
        if(!AuthService.getSessionId()) {
            $location.url('/login');
            return;
        }

        $scope.loadedCrews = false;
        $http({
            method: 'POST',
            url: '.crews.php',
            data: "session_id=" + AuthService.getSessionId() + "&view_date=" + DateService.formatViewDate($scope.viewDateWeek),
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
                console.log(response.data);
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
