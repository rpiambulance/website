angular.module('MinutesCtrl', []).controller('MinutesCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'Meeting Minutes';
    $scope.columns = true;

    $scope.sections = [
        {
            header: 'General Meeting Minutes',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe frameborder="0" class="embed-responsive-item" style="width: 100% !important; height: 100% !important;"' +
            'src="https://drive.google.com/embeddedfolderview?id=0B3mvXB0aR4DiejdzdG1TQlI1QWc#list"></iframe></div>'
        },
        {
            header: 'Officer Board Meeting Minutes',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe frameborder="0" class="embed-responsive-item" style="width: 100% !important; height: 100% !important;"' +
            'src="https://drive.google.com/embeddedfolderview?id=0B3mvXB0aR4DiejdzdG1TQlI1QWc#list"></iframe></div>'
        }

    ];
}]);