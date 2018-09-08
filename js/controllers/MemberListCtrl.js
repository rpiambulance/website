angular.module('MemberListCtrl', []).controller('MemberListCtrl', ['$scope', '$http', 'AuthService', function($scope, $http, AuthService) {
    $scope.lineSide = [];
    $scope.civilSide = [];
    $scope.otherOfficers = [];
    $scope.members = [];
    $scope.radioFilter = false;
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
            {field: 'backupcc', abbreviation: 'P-CC'},
            {field: 'crewchief', abbreviation: 'CC'},
            {field: 'cctrainer', abbreviation: 'CC-T'},
            {field: 'backupdriver', abbreviation: 'P-D'},
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
        url: 'member_table.php?session_id=' + AuthService.getSessionId(),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
    }).then(function (response) {
        $scope.members = response.data;
        response.data.forEach(function (elem) {
            if(elem.captain == 1 || elem.firstlt == 1 || elem.secondlt == 1) {
                $scope.lineSide.push(elem);
            } else if(elem.pres == 1 || elem.vicepres == 1) {
                $scope.civilSide.push(elem);
            } else if(elem.cprco == 1 || elem.radioco == 1 || elem.traincommchair == 1 || elem.schedco == 1 || ((elem.admin == 1) && (elem.captain == 0))) {
                $scope.otherOfficers.push(elem);
            }
        });
        $scope.otherOfficers.forEach(function (elem){
            elem.card_id = [];
            if(elem.radioco == 1){
                elem.card_id.push("Radio Coordinator");
                elem.email = "radio@rpiambulance.com";
            }
            if (elem.traincommchair == 1) {
                elem.card_id.push("Training Committee Chair");
                elem.email = "training@rpiambulance.com";
            }
            if (elem.schedco == 1) {
                elem.card_id.push("Scheduling Coordinator");
                elem.email = "scheduling@rpiambulance.com";
            }
            if (elem.cprco == 1) {
              elem.card_id.push("CPR Coordinator");
              elem.email = "cpr@rpiambulance.com";
            }
            if (elem.admin == 1 && (!(elem.captain == 1 || elem.traincommchair == 1))) {
                elem.card_id.push("Webmaster");
                elem.email = "webmaster@rpiambulance.com";
            }
            if (elem.radioid == 0){
                elem.radioid = '';
            }
        })
        $scope.otherOfficers.forEach(function (elem){
            elem.card_id = elem.card_id.join(", ");
        })
        // $scope.members.forEach(function (elem){
        //   if (elem.radionum == 0){
        //     elem.radionum = '9999';
        //   }
        // })

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
