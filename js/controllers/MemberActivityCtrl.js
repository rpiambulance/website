angular.module('MemberActivityCtrl', []).controller('MemberActivityCtrl', ['$scope', '$http', '$location', 'AuthService', 'DateService', function($scope, $http, $location, AuthService, DateService) {
    $scope.members = [];
    $scope.orderer = 'last_name';

    minDate = $location.search()['minDate'];
    maxDate = $location.search()['maxDate'];

    if (!maxDate) {
        var nowDate = new Date(); 
        var maxDate = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();    
    }

    if (!minDate) {
        var oneYearAgo = new Date();
        oneYearAgo.setFullYear( oneYearAgo.getFullYear() - 1 );
        var minDate = DateService.formatViewDate(oneYearAgo);//.getFullYear()+'-'+(oneYearAgo.getFullMonth()+1)+'-'+oneYearAgo.getDate();    
    }

    postData = "session_id=" + AuthService.getSessionId() + "&min_date=" + minDate + "&max_date=" + maxDate;

    $http({
        method: 'POST',
        url: '.member_activity.php',
        data: postData,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
    }).then(function (response) {
        $scope.members = response.data;
        $scope.sortFun = function(sortname) {
          if ($scope.orderer == sortname){
            $scope.orderer = '-'+sortname;
          }
          else {
            $scope.orderer = sortname;
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