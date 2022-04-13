var ctrl_name = 'SOGCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function($scope) {
    $scope.pageHeader = 'Standard Operating Guidelines';
    $scope.sections = [
        {
            header: '',
            internal_title: 'Leading Text',
            body: 'RPI Ambulance follows guidelines for conducting our day-to-day operations. They are defined in the documents ' +
            'listed below. These documents were last updated on their specified dates.'
        },

        {
            header: 'Standard Operating Guidelines',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=1L1WwOH2k5j9wnZ4lPwCyxdzYyARdj7Fs#list" width="100%" height="400" frameborder="0"></iframe></div>'
        }

    ];
}]);
