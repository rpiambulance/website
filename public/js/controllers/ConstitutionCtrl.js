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
            'and passed by the E-Board on October 23, 2014. \n <a href="../img/RPI_Ambulance_Constitution_UPDATED_OCTOBER_2014.pdf">Current Constitution</a>'
        }
    ];
}]);