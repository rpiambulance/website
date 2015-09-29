var ctrl_name = 'MiscFormsCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function($scope) {
    $scope.pageHeader = 'Miscellaneous Forms';
    $scope.sections = [ { header: '', internal_title: 'Links', body: 'LINKS HERE', centered: true } ];
}]);