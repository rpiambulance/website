var ctrl_name = 'GamesEventsCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function($scope) {

  $scope.getDatetime = function () {
    var date= new Date();
    var month_arr=[
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ]

    console.log(month_arr);

    var month= month_arr[date.getMonth()];


    return month;

  }
  $scope.month= $scope.getDatetime();

}]);
