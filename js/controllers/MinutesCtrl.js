angular.module('MinutesCtrl', []).controller('MinutesCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'Meeting Minutes';
    $scope.columns = false;

    $scope.sections = [
        {
            header: 'General Meeting Minutes',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=1GPvhPC7tFawNFCnhYg2EciWqHXqWafLb#list" width="650" height="400" frameborder="0"></iframe></div>'
        },
        {
            header: 'Officer Board Meeting Minutes',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=1rMhuwX8q3XqlkRVaGLvieDdQ_hkbzHAh#list" width="650" height="400" frameborder="0"></iframe></div>'
        }

    ];
}]);
