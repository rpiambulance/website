angular.module('InServiceTrainingCtrl', []).controller('InServiceTrainingCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'In Service Training';
    $scope.columns = true;

    $scope.sections = [
        {
            header: 'New York State DOH Forms',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe frameborder="0" class="embed-responsive-item" style="width: 100% !important; height: 100% !important;"' +
            'src="https://drive.google.com/embeddedfolderview?id=0B3mvXB0aR4DiejdzdG1TQlI1QWc#list"></iframe></div>'
        },
        {
            header: 'Agency-Specific Forms',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe frameborder="0" class="embed-responsive-item" style="width: 100% !important; height: 100% !important;"' +
            'src="https://drive.google.com/embeddedfolderview?id=0B3mvXB0aR4DiejdzdG1TQlI1QWc#list"></iframe></div>'
        }

    ];
}]);