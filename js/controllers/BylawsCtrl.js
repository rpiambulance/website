var ctrl_name = 'BylawsCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function($scope) {
    $scope.pageHeader = 'RPI Ambulance Bylaws';
    $scope.sections = [
        {
            header: '',
            internal_title: 'About Text',
            body: 'The Bylaws of RPI Ambulance cover the duties and ' +
            'responsibilities of committees and their chairs, misconduct and discipline policies for RPI ' +
            'Ambulance Members, and social media policies. The current Bylaws were ratified by the ' + 
            'general membership on September 15th, 2019. \n'
        },

        {
            header: 'Bylaws',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=1dNnyB9imWyOB6-1j-hQeiDXv0xqUTMaX#list" width="100%" height="400" frameborder="0"></iframe></div>'
        }
    ];
}]);