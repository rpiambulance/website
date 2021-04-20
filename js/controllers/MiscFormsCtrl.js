angular.module('MiscFormsCtrl', []).controller('MiscFormsCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'Miscellaneous Forms';
    $scope.columns = false;

    $scope.sections = [
        {
            header: 'Checklists',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=1dBbb1WCLtVXzFoyBAZKhs_8dBqg6z62B#list" width="800" height="400" frameborder="0"></iframe>'
        },

        {
            header: 'Training Forms',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=1OgqWm-RFUFoYASfRcgTRF3lwWbeWTpiT#list" width="800" height="400" frameborder="0"></iframe>'

        }

    ];
}]);
