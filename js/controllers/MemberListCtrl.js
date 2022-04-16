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

    $scope.determinePositionEmail = function (member_with_position){
        var email = "officers@rpiambulance.com";

        if (member_with_position.captain == 1){
            email = "captain@rpiambulance.com";
        } else if (member_with_position.firstlt == 1){
            email = "firstlt@rpiambulance.com";
        }else if (member_with_position.secondlt == 1){
            email = "secondlt@rpiambulance.com";
        }else if (member_with_position.pres == 1){
            email = "president@rpiambulance.com";
        }else if (member_with_position.vicepres == 1){
            email = "vp@rpiambulance.com";
        }else if (member_with_position.radioco == 1){
            email = "radios@rpiambulance.com";
        }else if (member_with_position.schedco == 1){
            email = "scheduling@rpiambulance.com";
        }else if (member_with_position.traincommchair == 1){
            email = "training@rpiambulance.com";
        }else if (member_with_position.cprco == 1){
            email = "cpr@rpiambulance.com";
        }else if (member_with_position.qaco == 1){
            email = "qa@rpiambulance.com";
        }else if (member_with_position.devco == 1){
            email = "dev@rpiambulance.com";
        }else if (member_with_position.webmaster == 1){
            email = "webmaster@rpiambulance.com";
        }else{
            email = member_with_position.email;
        }

        return email;
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
            } else if(elem.devco == 1 || elem.qaco == 1 || elem.cprco == 1 || elem.radioco == 1 || elem.traincommchair == 1 || elem.schedco == 1 || elem.webmaster == 1) {
                $scope.otherOfficers.push(elem);
            }
        });
        $scope.otherOfficers.forEach(function (elem){
            elem.card_id = [];
            if(elem.radioco == 1){
                elem.card_id.push("Radio Coordinator");
            }
            if (elem.traincommchair == 1) {
                elem.card_id.push("Training Committee Chair");
            }
            if (elem.schedco == 1) {
                elem.card_id.push("Scheduling Coordinator");
            }
            if (elem.cprco == 1) {
              elem.card_id.push("CPR Coordinator");
            }
            if (elem.qaco == 1) {
              elem.card_id.push("QA/QI Coordinator");
            }
            if (elem.devco == 1) {
              elem.card_id.push("Dev Team Coordinator");
            }
            if (elem.webmaster == 1) {
                elem.card_id.push("Webmaster");
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
