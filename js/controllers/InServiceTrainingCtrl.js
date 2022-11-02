angular.module('InServiceTrainingCtrl', []).controller('InServiceTrainingCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'In Service Training';
    $scope.columns = true;

    $scope.sections = [
        {
            header: 'New York State DOH Documents',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=1xK3c71AHyGNBoNSz1Lti6EuZtk72fHUG#list" width="650" height="400" frameborder="0"></iframe>'
        },
        {
            header: 'RPI Ambulance Documents',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=1h4v8WH_MqQWKYYThC1Vy7yvmkv6j1HGX#list" width="650" height="400" frameborder="0"></iframe>'
        }

    ];
}]);
