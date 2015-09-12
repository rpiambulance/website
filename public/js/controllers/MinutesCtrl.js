angular.module('MinutesCtrl', []).controller('MinutesCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'Meeting Minutes';

    $scope.minutes = [
        {header: 'General Meeting Minutes', folderId: '0B3mvXB0aR4DiejdzdG1TQlI1QWc'},
        {header: 'Officer Board Meeting Minutes', folderId: '0B3mvXB0aR4DiejdzdG1TQlI1QWc'}

    ];

    $scope.getDriveEmbed = function(id) {
        return 'https://drive.google.com/embeddedfolderview?id=' + id + '#list';
    };
}]);