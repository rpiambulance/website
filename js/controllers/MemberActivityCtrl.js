angular.module('MemberActivityCtrl', []).controller('MemberActivityCtrl', ['$scope', '$http', '$location', 'AuthService', 'DateService', function($scope, $http, $location, AuthService, DateService) {
    $scope.members = [];
    $scope.orderer = 'last_name';

    minDate = $location.search()['minDate'];
    maxDate = $location.search()['maxDate'];

    // default date range: one year from today
    if (!minDate) {
        var oneYearAgo = new Date();
        oneYearAgo.setFullYear( oneYearAgo.getFullYear() - 1 );
        // var minDate = formatDate(oneYearAgo, 'yyyy-MM-dd');
        var minDate = oneYearAgo.toJSON().split('T')[0];
    }
    if (!maxDate) {
        var nowDate = new Date(); 
        var maxDate = DateService.formatViewDate(nowDate)
    }

    $scope.min_date = minDate;
    $scope.max_date = maxDate;

    postData = "session_id=" + AuthService.getSessionId() + "&min_date=" + minDate + "&max_date=" + maxDate;

    $http({
        method: 'POST',
        url: '.member_activity.php',
        data: postData,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
    }).then(function (response) {
        $scope.members = Object.values(response.data);
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