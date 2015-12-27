angular.module('ReportIssueCtrl', []).controller('ReportIssueCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'Report an Issue';
    $scope.sections = [
        {
            header: 'We\'re so sorry something went wrong...',
            internal_title: 'Message',
            body: 'We\'re so sorry something isn\'t working quite right. Please use the following form to tell us more' +
                ' about the problem you\'ve just encountered.'
        },

        {
            header: 'Issue Report',
            internal_title: 'Form',
            body: '<iframe src="https://docs.google.com/a/rpiambulance.com/forms/d/1aig3C6XMon3KXLMxtUgDpSbKqsx_tB-ZPQE4uhXj0i0/viewform?embedded=true" width="760" height="500" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>'
        }

    ];
}]);