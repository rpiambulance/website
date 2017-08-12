angular.module('HomeCtrl', []).controller('HomeCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.events = [];
    $scope.readMore = function () {
        $('#main-slider').carousel('pause');
        $location.path('/' + $('.item.active').attr('id'));
    }


    $http({
      method: 'POST',
      url: 'front_events.php',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
  }).then(function (response) {
      $scope.events = [];
      var all_ev = response.data;

      all_ev.forEach(function(elem){
        if (elem.limit == -1) {
          $scope.events.push(elem);
        }
      });

      $scope.events.forEach(function (elem) {

        var dateParts = elem.date.split("-");
        elem.date = dateParts[1].replace(/^0+/, '') + '/' + dateParts[2].replace(/^0+/, '') + '/' + dateParts[0];

      });

      console.log($scope.events);
  });

}]);
