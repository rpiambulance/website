angular.module('InServiceTrainingCtrl', []).controller('InServiceTrainingCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'In Service Training';
    $scope.columns = true;

    $scope.sections = [
        {
            header: 'New York State DOH Documents',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=0BzoMrS_ZZPigTHRGVWdlaW05OWM#list" width="650" height="400" frameborder="0"></iframe>'
        },
        {
            header: 'RPI Ambulance Documents',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=0BzoMrS_ZZPigRl9naUlZWVR0eEE#list" width="650" height="400" frameborder="0"></iframe>'
        }

    ];
}]);