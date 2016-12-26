angular.module('EditDefaultCtrl', []).controller('EditDefaultCtrl', ['$scope', '$http', '$q', function($scope, $http, $q) {
    $scope.worked= null;
    $scope.days = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];

    $scope.roles = [
        'cc', 'driver', 'attendant', 'observer'
    ];

    $scope.changeMade = function () {
        $scope.areChangesPending = true;
    };

    function loadData () {
        $scope.defaultSchedule = [];

        $q.all([
            $http.get('member_table.php'),
            $http.get('.defaults.php')
        ]).then(function (responses) {
            $scope.members = responses[0].data;
            $scope.defaultSchedule = responses[1].data;
        });
    }
    loadData();

    $scope.validChoice = function (member, role) {
        if(role == 'cc') {
            return member.crewchief == 1 || member.cctrainer == 1 || member.backupcc == 1;
        } else if(role == 'driver') {
            return member.driver == 1 || member.drivertrainer == 1 || member.backupdriver == 1;
        } else {
            return member.attendant == 1 || member.observer == 1
        }
    }

    $scope.oos_all = function () {
        $scope.areChangesPending = true;

        for(var i = 0;  i < $scope.days.length; i++) {
            for(var j = 0; j < $scope.roles.length; j++) {
                $scope.defaultSchedule[i][$scope.roles[j]] = -2;
            }
        }
    };

    $scope.save = function () {
        if(!$scope.areChangesPending) {
            return;
        }

        var data = 'data=' + JSON.stringify($scope.defaultSchedule) + '&session_id=' + $scope.getSessionIDCookie();

        $http({
            method: 'POST',
            url: '.defaults.php',
            data: data, // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
        }).success(function (data) {
            console.log(data);
            $scope.worked= data.success;
            if (!data.success) {
                console.log("it failed!");
                $scope.submission = true; //shows the error message
                $scope.showError= true;
            } else {
                console.log("it succeeded!");

                $scope.areChangesPending = false;

                $scope.showContactSuccess = true;
                // if successful, bind success message to message
                $scope.submissionMessage = data.messageSuccess;
                $scope.submission = true; //shows the success message
            }
        });
    };

    $scope.cancel = function () {
        $scope.areChangesPending = false;
        loadData();
    };
}]);
