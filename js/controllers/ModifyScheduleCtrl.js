var ctrl_name = 'ModifyScheduleCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', '$http', '$q', 'AuthService', 'DateService', function($scope, $http, $q, AuthService, DateService) {
    var currentDate = new Date();
    currentDate.setHours(12, 0, 0, 0);
    $scope.currentWeek = new Date(currentDate.getTime() - (currentDate.getDay() * 86400000));

    $scope.currentWeekCrews = [];
    $scope.upcomingWeekCrews = [];
    $scope.members = [];
    $scope.showSuccess = false;

    $scope.tables = [
        {
            attribute: 'currentWeek',
            title: 'Current Week'
        }, {
            attribute: 'nextWeek',
            title: 'Upcoming Week'
        }
    ];

    $scope.load = function () {
        $q.all([
            $http({
                method: 'POST',
                url: '.crews.php',
                data: "session_id=" + AuthService.getSessionId() + "&view_date=" + DateService.formatViewDate($scope.currentWeek),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }),
            $http({
                method: 'POST',
                url: 'member_table.php?session_id=' + AuthService.getSessionId(),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
        ]).then(function (responses) {

            $scope.tableHeadings = responses[0].data.headings;
            $scope.crews = responses[0].data.crews;
            $scope.positions = responses[0].data.positions;
            $scope.modifyScheduleSignature = responses[0].data.modifyScheduleSignature;
            $scope.username = responses[0].data.username;

            // $scope.currentWeekCrews = responses[0].data.crews.currentWeek;
            // $scope.upcomingWeekCrews = responses[0].data.crews.nextWeek;

            $scope.members = responses[1].data;
        });
    };
    $scope.load();

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
            console.log(response);
            if (!response.data.success) {
                console.log("it failed!");
                console.log(response.data);
            } else {
                // Since the crews come in order of latest first, we need to separate
                // them in a way that almost seems backwards.
                $scope.tableHeadings = response.data.headings;
                $scope.crews = response.data.crews;
                $scope.positions = response.data.positions;
                $scope.loadedCrews = true;
            }
        });
    };


    $scope.determineEligibility = function(position, member, crew) {
        for(var i = 0; i < $scope.positions.length; i++) {
            if($scope.positions[i] == position) continue;

            if(crew.spots[$scope.positions[i]].id == member.id) return false;
        }

        if(position == 'cc') {
            return member.crewchief == 1 || member.firstresponsecc == 1 || member.cctrainer == 1 || member.backupcc == 1;
        } else if(position == 'driver') {
            return member.driver == 1 || member.drivertrainer == 1 || member.backupdriver == 1;
        } else if(position == 'dutysup') {
            return member.dutysup == 1;
        } else if(position == 'attendant' || position == 'observer') {
            return true;
        }
    };

    $scope.changeMade = function (spot) {
        $scope.areChangesPending = true;
        spot.changed = true;
    };

    $scope.fixBlank = function (id) {
        if(id == null) {
            return '0';
        } else {
            return id;
        }
    }

    $scope.save = function () {
        if(!$scope.areChangesPending) {
            return;
        }

        var data = 'data=' + JSON.stringify($scope.crews) +
            '&session_id=' + $scope.getSessionIDCookie() +
            '&signature=' + $scope.modifyScheduleSignature +
            '&username=' + $scope.username;

        $http({
            method: 'POST',
            url: '.modify_schedule.php?session_id=' + AuthService.getSessionId(),
            data: data, // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
        }).then(function (data) {
            $scope.worked= data.data.success;
            if (!data.data.success) {
                $scope.submission = true; //shows the error message
                $scope.showError= true;
            } else {

                $scope.showSuccess =  true;
                $scope.areChangesPending = false;

                $scope.load();
            }
        });
    };

    $scope.cancel = function () {
        $scope.areChangesPending = false;
        $scope.load();
    }

    $scope.clearUpcoming = function () {
        $scope.crews['nextWeek'].forEach(function (c) {
            $scope.positions.forEach(function (p) {
                c.spots[p].id = '0';
                c.spots[p].vacant = true;
                c.spots[p].changed = true;
            });
        });

        $scope.areChangesPending = true;
    }
}]);
