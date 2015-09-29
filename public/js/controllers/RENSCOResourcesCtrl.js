var ctrl_name = 'RENSCOResourcesCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function($scope) {
    $scope.pageHeader = 'Rensselaer County Resources';
    $scope.sections = [ { header: '', internal_title: 'Links', body: 'LINKS HERE', centered: true } ];
}]);