angular.module('NightCrewsCtrl', []).controller('NightCrewsCtrl', ['$scope', '$http', 'AuthService', function ($scope, $http, AuthService) {
    AuthService.getUserMetadata().then(function (data) {
        console.log(data);
        $scope.username = data.username;
        $scope.crewchief = data.crewchief == 1;
        $scope.cctrainer = data.cctrainer == 1;
        $scope.backupcc = data.backupcc == 1;
        $scope.driver = data.driver == 1;
        $scope.drivertrainer = data.drivertrainer == 1;

    }, function (error) { console.log(error); });

    $scope.currentWeekCrews = [];
    $scope.upcomingWeekCrews = [];

    $http({
        method: 'POST',
        url: '.crews.php',
        data: "session_id=" + AuthService.getSessionId(),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function (response) {
        console.log('we here', response);
        if (!response.data.success) {
            console.log(response.data);
            console.log("it failed!");
            // if not successful, bind errors to error variables

            $scope.submission = true; //shows the error message
        } else {
            // Since the crews come in order of latest first, we need to separate
            // them in a way that almost seems backwards.

            console.log(response.data.result);

            $scope.currentWeekCrews = response.data.result.slice(7);
            $scope.upcomingWeekCrews = response.data.result.slice(0, 7);
        }
    });

    $scope.number = 7;
    $scope.getNumber = function (num) {
        return new Array(num);
    };

    $scope.clearForm = function () {
        for (var d in $scope.formData) {
            if ($scope.formData.hasOwnProperty(d))
                $scope.formData[d] = "";
        }
    };

    $scope.formatName = function (first, last) {
        return first ? (first.substr(0,1) + '. ' + last) : (last ? last : '');
    };

    $scope.canDelete = function (username) {
        return username === $scope.username;
    };

    $scope.canRegisterCC = function (crew) {
        return $scope.crewchief || $scope.cctrainer;
    };

    $scope.canRegisterDriver = function (crew) {
        return $scope.driver || $scope.drivertrainer;
    };
}]);
