var ctrl_name = 'EditEventCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', '$routeParams', function($scope, $routeParams) {

  $scope.chooseEven = function (member) {
      $location.path('/edit-event/' + member.id);
  };

  function loadData () {

          $http.get('.edit_event.php?event_id=' + $routeParams.event_id).then(function (response) {
              $scope.selectedEvent = response.data[0];
              memberPostProcessing($scope.selectedEvent);
          });
  };

  loadData();

}]);
