angular.module('MiscFormsCtrl', []).controller('MiscFormsCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'Miscellaneous Forms';
    $scope.columns = false;

    $scope.sections = [
        {
            header: 'Checklists',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe frameborder="0" class="embed-responsive-item" style="width: 100% !important; height: 100% !important;"' +
            'src="https://drive.google.com/embeddedfolderview?id=0B3mvXB0aR4DiejdzdG1TQlI1QWc#list"></iframe></div>'
        },

        {
            header: 'Training Forms',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=0B7_ZvoVxWf0qVUE0TDVuSXlOYnM" width="800" height="600" frameborder="0"></iframe>'

        }

    ];
}]);