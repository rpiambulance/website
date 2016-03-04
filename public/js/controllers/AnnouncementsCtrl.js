var ctrl_name = 'AnnouncementsCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function ($scope) {
    $scope.pageHeader = 'Announcements';
    $scope.columns = false;
    $scope.sections = [
        {
            header: 'FREE PIE',
            internal_title: 'FREE PIE',
            body: 'Hi Everyone, \n\n I as President of the agency declare that everyone shall give Sparky free pie on ' +
            'pi day. That is all. \n\n &mdash; Ciera'
        }

    ];
}]);