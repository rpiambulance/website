var ctrl_name = 'ConstitutionCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function($scope) {
    $scope.pageHeader = 'RPI Ambulance Constitution';
    $scope.sections = [
        {
            header: '',
            internal_title: 'About Text',
            body: 'The Constitution of RPI Ambulance is our governing document. It covers the duties and ' +
            'responsibilities of officers, procedures for meetings and elections, and conduct guidelines for RPI ' +
            'Ambulance Members. The current Constitution was ratified by the general membership on September 23, 2014, ' +
            'and passed by the E-Board on October 23, 2014. \n'
        },

        {
            header: 'Constitution',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=0BzoMrS_ZZPigLVdIU2s3U0MtUzg#list" width="100%" height="400" frameborder="0"></iframe></div>'
        }
    ];
}]);