angular.module('MemberActivityCtrl', []).controller('MemberActivityCtrl', ['$scope', '$http', 'AuthService', function($scope, $http, AuthService) {
    $scope.members = [];
    $scope.orderer = 'last_name';

    function positionHelper(positions, member, fieldToCheck, toAdd) {
        if(member[fieldToCheck] == 1) {
            return (positions.length > 0 ? ", " : "") + toAdd;
        } else {
            return "";
        }
    }

    $scope.determinePositions = function (member) {
        var possiblePositions = [
            {field: 'dutysup', abbreviation: 'DS'},
            {field: 'ees', abbreviation: 'EES'},
            {field: 'firstresponsecc', abbreviation: 'FR-CC'},
            {field: 'clearedcc', abbreviation: 'A-CC'},
            {field: 'backupcc', abbreviation: 'P-CC'},
            {field: 'crewchief', abbreviation: 'CC'},
            {field: 'cctrainer', abbreviation: 'CC-T'},
            {field: 'backupdriver', abbreviation: 'P-D'},
            {field: 'cleareddriver', abbreviation: 'A-D'},
            {field: 'driver', abbreviation: 'D'},
            {field: 'drivertrainer', abbreviation: 'D-T'}
        ];

        var positions = "";

        possiblePositions.forEach(function (elem) {
            positions += positionHelper(positions, member, elem.field, elem.abbreviation);
        });

        if (member.dutysup == 1){
            positions = 'DS'
        } else if(positions.length === 0 && member.attendant == 1) {
            positions += 'A';
        } else if(positions.length === 0 && member.observer == 1) {
            positions += 'O';
        }

        return positions;
    }

    $http({
        method: 'POST',
        url: '.member_activity.php?session_id=' + AuthService.getSessionId(),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
    }).then(function (response) {
        $scope.members = response.data;
        $scope.sortFun = function(sortname) {
     			if ($scope.orderer == sortname){
  	        $scope.orderer = '-'+sortname;
          }
          else {
          $scope.orderer = sortname;
          }
        }
    });
}]).filter("emptyToEnd", function () {
    return function (array, key) {
        if(!angular.isArray(array)) return;
        var present = array.filter(function (item) {
            return item[key];
        });
        var empty = array.filter(function (item) {
            return !item[key]
        });
        return present.concat(empty);
    };
});
;
