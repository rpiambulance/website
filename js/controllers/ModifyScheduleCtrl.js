var ctrl_name = 'ModifyScheduleCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', '$http', '$q', 'AuthService', function($scope, $http, $q, AuthService) {
    $scope.currentWeekCrews = [];
    $scope.upcomingWeekCrews = [];
    $scope.members = [];

    $scope.load = function () {
        $q.all([
            $http({
                method: 'POST',
                url: '.crews.php',
                data: "session_id=" + AuthService.getSessionId(),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }),
            $http({
                method: 'POST',
                url: 'member_table.php',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
        ]).then(function (responses) {
            console.log(responses)
            $scope.currentWeekCrews = responses[0].data.result.slice(7);
            $scope.upcomingWeekCrews = responses[0].data.result.slice(0, 7);

            $scope.members = responses[1].data;
        });
    };
    $scope.load();
}]);
