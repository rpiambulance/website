angular.module('MemberActivityCtrl', []).controller('MemberActivityCtrl', ['$scope', '$http', 'AuthService', function($scope, $http, AuthService) {
    $scope.members = [];
    $scope.orderer = 'last_name';

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
