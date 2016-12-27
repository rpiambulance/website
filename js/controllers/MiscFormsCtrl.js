angular.module('MiscFormsCtrl', []).controller('MiscFormsCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'Miscellaneous Forms';
    $scope.columns = false;

    $scope.sections = [
        {
            header: 'Checklists',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=0BzoMrS_ZZPigVEJiNURXX2dPb0U#list" width="800" height="400" frameborder="0"></iframe>'
        },

        {
            header: 'Training Forms',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=0BzoMrS_ZZPigdk9ncFBaX2RwMzQ#list" width="800" height="400" frameborder="0"></iframe>'

        }

    ];
}]);