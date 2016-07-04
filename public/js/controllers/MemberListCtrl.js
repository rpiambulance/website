angular.module('MemberListCtrl', []).controller('MemberListCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.lineSide = [];
    $scope.civilSide = [];
    $scope.otherOfficers = [];
    $scope.members = [];
    $scope.radioFilter = false;

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
            {field: 'crewchief', abbreviation: 'CC'},
            {field: 'cctrainer', abbreviation: 'CC-T'},
            {field: 'driver', abbreviation: 'D'},
            {field: 'drivertrainer', abbreviation: 'D-T'}
        ];

        var positions = "";

        possiblePositions.forEach(function (elem) {
            positions += positionHelper(positions, member, elem.field, elem.abbreviation);
        });

        if(positions.length === 0 && member.attendant == 1) {
            positions += 'A';
        } else if(positions.length === 0 && member.observer == 1) {
            positions += 'O';
        }

        return positions;
    }

    $http({
        method: 'POST',
        url: 'member_table.php',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
    }).success(function (response) {
        $scope.members = response;
        response.forEach(function (elem) {
            if(elem.captain == 1 || elem.firstlt == 1 || elem.secondlt == 1) {
                $scope.lineSide.push(elem);
            } else if(elem.pres == 1 || elem.vicepres == 1) {
                $scope.civilSide.push(elem);
            } else if(elem.radioco == 1 || elem.traincommchair == 1 || elem.schedco == 1 || ((elem.admin == 1) && (elem.captain == 0))) {
                $scope.otherOfficers.push(elem);
            }
        });
    });
}]);
