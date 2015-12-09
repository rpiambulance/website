angular.module('ReportIssueCtrl', []).controller('ReportIssueCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'Report an Issue';
    $scope.sections = [
        {
            header: 'We\'re so sorry something went wrong...',
            internal_title: 'Message',
            body: 'We\'re so sorry something isn\'t working quite right. Please use the following form to tell us more' +
                ' about the problem you\'ve just encountered.'
        }

    ];
}]);