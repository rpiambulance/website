var ctrl_name = 'SOPCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function($scope) {
    $scope.pageHeader = 'Standard Operating Procedures';
    $scope.sections = [
        {
            header: '',
            internal_title: 'Leading Text',
            body: 'RPI Ambulance follows guidelines for conducting our day-to-day operations. They are defined in the documents ' +
            'listed below. These documents were last updated on their specified dates.'
        },

        {
            header: 'Standard Operating Procedures',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=0BzoMrS_ZZPigM05UOE5oV3dVZms#list" width="100%" height="400" frameborder="0"></iframe></div>'
        }

    ];
}]);