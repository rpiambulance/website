
angular.module('GamesEventsCtrl', ['mwl.calendar', 'ui.bootstrap']).controller('GamesEventsCtrl', ['$scope', function($scope) {

  getDatetime = function () {
    var date= new Date();
    var month_arr=[
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ]

    var month= month_arr[date.getMonth()];

    return month;

  }

  $scope.month= getDatetime();

}]);
